# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import ast
import io
import operator
import os
import sys
import textwrap
import token
import tokenize


class Visitor(ast.NodeVisitor):
    def __init__(self, lines):
        self._lines = lines
        self.line_numbers_with_nodes = set()
        self.line_numbers_with_statements = []

    def generic_visit(self, node):
        if hasattr(node, 'col_offset') and hasattr(node, 'lineno') and node.col_offset == 0:
            self.line_numbers_with_nodes.add(node.lineno)
            if isinstance(node, ast.stmt):
                self.line_numbers_with_statements.append(node.lineno)

        ast.NodeVisitor.generic_visit(self, node)


def _tokenize(source):
    """Tokenize Python source code."""
    # Using an undocumented API as the documented one in Python 2.7 does not work as needed
    # cross-version.
    if sys.version_info < (3,) and isinstance(source, str):
        source = source.decode()
    return tokenize.generate_tokens(io.StringIO(source).readline)


def _indent_size(line):
    for index, char in enumerate(line):
        if not char.isspace():
            return index


def _get_global_statement_blocks(source, lines):
    """Return a list of all global statement blocks.

    The list comprises of 3-item tuples that contain the starting line number,
    ending line number and whether the statement is a single line.

    """
    tree = ast.parse(source)
    visitor = Visitor(lines)
    visitor.visit(tree)

    statement_ranges = []
    for index, line_number in enumerate(visitor.line_numbers_with_statements):
        remaining_line_numbers = visitor.line_numbers_with_statements[index+1:]
        end_line_number = len(lines) if len(remaining_line_numbers) == 0 else min(remaining_line_numbers) - 1
        current_statement_is_oneline = line_number == end_line_number

        if len(statement_ranges) == 0:
            statement_ranges.append((line_number, end_line_number, current_statement_is_oneline))
            continue

        previous_statement = statement_ranges[-1]
        previous_statement_is_oneline = previous_statement[2]
        if previous_statement_is_oneline and current_statement_is_oneline:
            statement_ranges[-1] = previous_statement[0], end_line_number, True
        else:
            statement_ranges.append((line_number, end_line_number, current_statement_is_oneline))

    return statement_ranges


def normalize_lines(source):
    """Normalize blank lines for sending to the terminal.

    Blank lines within a statement block are removed to prevent the REPL
    from thinking the block is finished. Newlines are added to separate
    top-level statements so that the REPL does not think there is a syntax
    error.

    """
    # Ensure to dedent the code (#2837)
    lines = textwrap.dedent(source).splitlines(False)
    # If we have two blank lines, then add two blank lines.
    # Do not trim the spaces, if we have blank lines with spaces, its possible
    # we have indented code.
    if (len(lines) > 1 and len(''.join(lines[-2:])) == 0) \
        or source.endswith(('\n\n', '\r\n\r\n')):
        trailing_newline = '\n' * 2
    # Find out if we have any trailing blank lines
    elif len(lines[-1].strip()) == 0 or source.endswith(('\n', '\r\n')):
        trailing_newline = '\n'
    else:
        trailing_newline = ''

    # Step 1: Remove empty lines.
    tokens = _tokenize(source)
    newlines_indexes_to_remove = (spos[0] for (toknum, tokval, spos, epos, line) in tokens
                                  if len(line.strip()) == 0
                                     and token.tok_name[toknum] == 'NL'
                                     and spos[0] == epos[0])

    for line_number in reversed(list(newlines_indexes_to_remove)):
        del lines[line_number-1]

    # Step 2: Add blank lines between each global statement block.
    # A consecutive single lines blocks of code will be treated as a single statement,
    # just to ensure we do not unnecessarily add too many blank lines.
    source = '\n'.join(lines)
    tokens = _tokenize(source)
    dedent_indexes = (spos[0] for (toknum, tokval, spos, epos, line) in tokens
                                if toknum == token.DEDENT and _indent_size(line) == 0)

    global_statement_ranges = _get_global_statement_blocks(source, lines)
    start_positions = map(operator.itemgetter(0), reversed(global_statement_ranges))
    for line_number in filter(lambda x: x > 1, start_positions):
        lines.insert(line_number-1, '')

    sys.stdout.write('\n'.join(lines) + trailing_newline)
    sys.stdout.flush()


if __name__ == '__main__':
    contents = sys.argv[1]
    try:
        default_encoding = sys.getdefaultencoding()
        encoded_contents = contents.encode(default_encoding, 'surrogateescape')
        contents = encoded_contents.decode(default_encoding, 'replace')
    except (UnicodeError, LookupError):
        pass
    if isinstance(contents, bytes):
        contents = contents.decode('utf8')
    normalize_lines(contents)
