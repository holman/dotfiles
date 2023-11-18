import os

from jedi._compatibility import FileNotFoundError, force_unicode, scandir
from jedi.inference.names import AbstractArbitraryName
from jedi.api import classes
from jedi.inference.helpers import get_str_or_none
from jedi.parser_utils import get_string_quote


def file_name_completions(inference_state, module_context, start_leaf, string,
                          like_name, call_signatures_callback, code_lines, position):
    # First we want to find out what can actually be changed as a name.
    like_name_length = len(os.path.basename(string) + like_name)

    addition = _get_string_additions(module_context, start_leaf)
    if addition is None:
        return
    string = addition + string

    # Here we use basename again, because if strings are added like
    # `'foo' + 'bar`, it should complete to `foobar/`.
    must_start_with = os.path.basename(string) + like_name
    string = os.path.dirname(string)

    sigs = call_signatures_callback()
    is_in_os_path_join = sigs and all(s.full_name == 'os.path.join' for s in sigs)
    if is_in_os_path_join:
        to_be_added = _add_os_path_join(module_context, start_leaf, sigs[0].bracket_start)
        if to_be_added is None:
            is_in_os_path_join = False
        else:
            string = to_be_added + string
    base_path = os.path.join(inference_state.project._path, string)
    try:
        listed = scandir(base_path)
    except FileNotFoundError:
        return
    for entry in listed:
        name = entry.name
        if name.startswith(must_start_with):
            if is_in_os_path_join or not entry.is_dir():
                if start_leaf.type == 'string':
                    quote = get_string_quote(start_leaf)
                else:
                    assert start_leaf.type == 'error_leaf'
                    quote = start_leaf.value
                potential_other_quote = \
                    code_lines[position[0] - 1][position[1]:position[1] + len(quote)]
                # Add a quote if it's not already there.
                if quote != potential_other_quote:
                    name += quote
            else:
                name += os.path.sep

            yield classes.Completion(
                inference_state,
                FileName(inference_state, name[len(must_start_with) - like_name_length:]),
                stack=None,
                like_name_length=like_name_length
            )


def _get_string_additions(module_context, start_leaf):
    def iterate_nodes():
        node = addition.parent
        was_addition = True
        for child_node in reversed(node.children[:node.children.index(addition)]):
            if was_addition:
                was_addition = False
                yield child_node
                continue

            if child_node != '+':
                break
            was_addition = True

    addition = start_leaf.get_previous_leaf()
    if addition != '+':
        return ''
    context = module_context.create_context(start_leaf)
    return _add_strings(context, reversed(list(iterate_nodes())))


def _add_strings(context, nodes, add_slash=False):
    string = ''
    first = True
    for child_node in nodes:
        values = context.infer_node(child_node)
        if len(values) != 1:
            return None
        c, = values
        s = get_str_or_none(c)
        if s is None:
            return None
        if not first and add_slash:
            string += os.path.sep
        string += force_unicode(s)
        first = False
    return string


class FileName(AbstractArbitraryName):
    api_type = u'path'
    is_value_name = False


def _add_os_path_join(module_context, start_leaf, bracket_start):
    def check(maybe_bracket, nodes):
        if maybe_bracket.start_pos != bracket_start:
            return None

        if not nodes:
            return ''
        context = module_context.create_context(nodes[0])
        return _add_strings(context, nodes, add_slash=True) or ''

    if start_leaf.type == 'error_leaf':
        # Unfinished string literal, like `join('`
        value_node = start_leaf.parent
        index = value_node.children.index(start_leaf)
        if index > 0:
            error_node = value_node.children[index - 1]
            if error_node.type == 'error_node' and len(error_node.children) >= 2:
                index = -2
                if error_node.children[-1].type == 'arglist':
                    arglist_nodes = error_node.children[-1].children
                    index -= 1
                else:
                    arglist_nodes = []

                return check(error_node.children[index + 1], arglist_nodes[::2])
        return None

    # Maybe an arglist or some weird error case. Therefore checked below.
    searched_node_child = start_leaf
    while searched_node_child.parent is not None \
            and searched_node_child.parent.type not in ('arglist', 'trailer', 'error_node'):
        searched_node_child = searched_node_child.parent

    if searched_node_child.get_first_leaf() is not start_leaf:
        return None
    searched_node = searched_node_child.parent
    if searched_node is None:
        return None

    index = searched_node.children.index(searched_node_child)
    arglist_nodes = searched_node.children[:index]
    if searched_node.type == 'arglist':
        trailer = searched_node.parent
        if trailer.type == 'error_node':
            trailer_index = trailer.children.index(searched_node)
            assert trailer_index >= 2
            assert trailer.children[trailer_index - 1] == '('
            return check(trailer.children[trailer_index - 1], arglist_nodes[::2])
        elif trailer.type == 'trailer':
            return check(trailer.children[0], arglist_nodes[::2])
    elif searched_node.type == 'trailer':
        return check(searched_node.children[0], [])
    elif searched_node.type == 'error_node':
        # Stuff like `join(""`
        return check(arglist_nodes[-1], [])
