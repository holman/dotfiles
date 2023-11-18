'use strict';

import vscode = require('vscode');
import { guessScope, Proto3ScopeKind } from './proto3ScopeGuesser';

let kwSyntax = createCompletionKeyword('syntax');
let kwPackage = createCompletionKeyword('package');
let kwOption = createCompletionKeyword('option');
let kwImport = createCompletionKeyword('import');
let kwMessage = createCompletionKeyword('message');
let kwEnum = createCompletionKeyword('enum');
let kwReserved = createCompletionKeyword('reserved');

let fileOptions = [
    createCompletionOption('java_package', `
Sets the Java package where classes generated from this .proto will be
placed.  By default, the proto package is used, but this is often
inappropriate because proto packages do not normally start with backwards
domain names.
    `),
    createCompletionOption('java_outer_classname', `
If set, all the classes from the .proto file are wrapped in a single
outer class with the given name.  This applies to both Proto1
(equivalent to the old "--one_java_file" option) and Proto2 (where
a .proto always translates to a single class, but you may want to
explicitly choose the class name).
    `),
    createCompletionOption('java_multiple_files', `
If set true, then the Java code generator will generate a separate .java
file for each top-level message, enum, and service defined in the .proto
file.  Thus, these types will *not* be nested inside the outer class
named by java_outer_classname.  However, the outer class will still be
generated to contain the file's getDescriptor() method as well as any
top-level extensions defined in the file.
    `),
    createCompletionOption('java_generate_equals_and_hash', `
If set true, then the Java code generator will generate equals() and
hashCode() methods for all messages defined in the .proto file.
This increases generated code size, potentially substantially for large
protos, which may harm a memory-constrained application.
- In the full runtime this is a speed optimization, as the
AbstractMessage base class includes reflection-based implementations of
these methods.
- In the lite runtime, setting this option changes the semantics of
equals() and hashCode() to more closely match those of the full runtime;
the generated methods compute their results based on field values rather
than object identity. (Implementations should not assume that hashcodes
will be consistent across runtimes or versions of the protocol compiler.)
    `),
    createCompletionOption('java_string_check_utf8', `
If set true, then the Java2 code generator will generate code that
throws an exception whenever an attempt is made to assign a non-UTF-8
byte sequence to a string field.
Message reflection will do the same.
However, an extension field still accepts non-UTF-8 byte sequences.
This option has no effect on when used with the lite runtime.
    `),
    createCompletionOption('optimize_for', `
Generated classes can be optimized for speed or code size.
    `),
    createCompletionOption('go_package', `
Sets the Go package where structs generated from this .proto will be
placed. If omitted, the Go package will be derived from the following:
  - The basename of the package import path, if provided.
  - Otherwise, the package statement in the .proto file, if present.
  - Otherwise, the basename of the .proto file, without extension.
    `),
    //createCompletionOption('cc_generic_services'),
    //createCompletionOption('java_generic_services'),
    //createCompletionOption('py_generic_services'),
    createCompletionOption('deprecated', `
Is this file deprecated?
Depending on the target platform, this can emit Deprecated annotations
for everything in the file, or it will be completely ignored; in the very
least, this is a formalization for deprecating files.
    `),
    createCompletionOption('cc_enable_arenas', `
Enables the use of arenas for the proto messages in this file. This applies
only to generated classes for C++.
    `),
    createCompletionOption('objc_class_prefix', `
Sets the objective c class prefix which is prepended to all objective c
generated classes from this .proto. There is no default.
    `),
    createCompletionOption('csharp_namespace', `
Namespace for generated classes; defaults to the package.
    `),
];

let msgOptions = [
    createCompletionOption('message_set_wire_format', `
Set true to use the old proto1 MessageSet wire format for extensions.
This is provided for backwards-compatibility with the MessageSet wire
format.  You should not use this for any other reason:  It's less
efficient, has fewer features, and is more complicated.
    `),
    createCompletionOption('no_standard_descriptor_accessor', `
Disables the generation of the standard "descriptor()" accessor, which can
conflict with a field of the same name.  This is meant to make migration
from proto1 easier; new code should avoid fields named "descriptor".
    `),
    createCompletionOption('deprecated', `
Is this message deprecated?
Depending on the target platform, this can emit Deprecated annotations
for the message, or it will be completely ignored; in the very least,
this is a formalization for deprecating messages.
    `),
    //createCompletionOption('map_entry', ``),
];

let fieldOptions = [
    //createCompletionOption('ctype', ``),
    createCompletionOption('packed', `
The packed option can be enabled for repeated primitive fields to enable
a more efficient representation on the wire. Rather than repeatedly
writing the tag and type for each element, the entire array is encoded as
a single length-delimited blob. In proto3, only explicit setting it to
false will avoid using packed encoding.
    `),
    createCompletionOption('jstype', `
The jstype option determines the JavaScript type used for values of the
field.  The option is permitted only for 64 bit integral and fixed types
(int64, uint64, sint64, fixed64, sfixed64).  By default these types are
represented as JavaScript strings.  This avoids loss of precision that can
happen when a large value is converted to a floating point JavaScript
numbers.  Specifying JS_NUMBER for the jstype causes the generated
JavaScript code to use the JavaScript "number" type instead of strings.
This option is an enum to permit additional types to be added,
e.g. goog.math.Integer.
    `),
    createCompletionOption('lazy', `
Should this field be parsed lazily?  Lazy applies only to message-type
fields.  It means that when the outer message is initially parsed, the
inner message's contents will not be parsed but instead stored in encoded
form.  The inner message will actually be parsed when it is first accessed.

This is only a hint.  Implementations are free to choose whether to use
eager or lazy parsing regardless of the value of this option.  However,
setting this option true suggests that the protocol author believes that
using lazy parsing on this field is worth the additional bookkeeping
overhead typically needed to implement it.

This option does not affect the public interface of any generated code;
all method signatures remain the same.  Furthermore, thread-safety of the
interface is not affected by this option; const methods remain safe to
call from multiple threads concurrently, while non-const methods continue
to require exclusive access.


Note that implementations may choose not to check required fields within
a lazy sub-message.  That is, calling IsInitialized() on the outher message
may return true even if the inner message has missing required fields.
This is necessary because otherwise the inner message would have to be
parsed in order to perform the check, defeating the purpose of lazy
parsing.  An implementation which chooses not to check required fields
must be consistent about it.  That is, for any particular sub-message, the
implementation must either *always* check its required fields, or *never*
check its required fields, regardless of whether or not the message has
been parsed.
    `),
    createCompletionOption('deprecated', `
Is this field deprecated?
Depending on the target platform, this can emit Deprecated annotations
for accessors, or it will be completely ignored; in the very least, this
is a formalization for deprecating fields.
    `),
];

let fieldDefault = createCompletionOption('default', ``);

let enumOptions = [
    createCompletionOption('allow_alias', `
Set this option to true to allow mapping different tag names to the same
value.
    `),
    createCompletionOption('deprecated', `
Is this enum deprecated?
Depending on the target platform, this can emit Deprecated annotations
for the enum, or it will be completely ignored; in the very least, this
is a formalization for deprecating enums.
    `),
];

let enumValueOptions = [
    createCompletionOption('deprecated', `
Is this enum value deprecated?
Depending on the target platform, this can emit Deprecated annotations
for the enum value, or it will be completely ignored; in the very least,
this is a formalization for deprecating enum values.
    `),
];

let serviceOptions = [
    createCompletionOption('deprecated', `
Is this service deprecated?
Depending on the target platform, this can emit Deprecated annotations
for the service, or it will be completely ignored; in the very least,
this is a formalization for deprecating services.
    `),
];

let fieldRules = [
    createCompletionKeyword('repeated'),
    createCompletionKeyword('required'),
    createCompletionKeyword('optional'),
];

let scalaTypes = [
    createCompletionKeyword('bool', ``),
    createCompletionKeyword('int32', `
Uses variable-length encoding. 
Inefficient for encoding negative numbers – if your field is likely to have 
negative values, use sint32 instead.`
    ),
    createCompletionKeyword('int64', `
Uses variable-length encoding. 
Inefficient for encoding negative numbers – if your field is likely to have 
negative values, use sint64 instead.    
    `),
    createCompletionKeyword('uint32', `Uses variable-length encoding.`),
    createCompletionKeyword('uint64', `Uses variable-length encoding.`),
    createCompletionKeyword('sint32', `
Uses variable-length encoding. 
Signed int value. 
These more efficiently encode negative numbers than regular int32s.    
    `),
    createCompletionKeyword('sint64', `
Uses variable-length encoding. 
Signed int value. 
These more efficiently encode negative numbers than regular int64s.    
    `),
    createCompletionKeyword('fixed32', `
Always four bytes. 
More efficient than uint32 if values are often greater than 2^28.    
    `),
    createCompletionKeyword('fixed64', `
Always eight bytes. 
More efficient than uint64 if values are often greater than 2^56.    
    `),
    createCompletionKeyword('sfixed32', `Always four bytes.`),
    createCompletionKeyword('sfixed64', `Always eight bytes.`),
    createCompletionKeyword('float', ``),
    createCompletionKeyword('double', ``),
    createCompletionKeyword('string', `
A string must always contain UTF-8 encoded or 7-bit ASCII text.
    `),
    createCompletionKeyword('bytes', `
May contain any arbitrary sequence of bytes.
    `),
];

function createCompletionKeyword(label: string, doc?: string): vscode.CompletionItem {
    let item = new vscode.CompletionItem(label);
    item.kind = vscode.CompletionItemKind.Keyword;
    if (doc) {
        item.documentation = doc;
    }
    return item
}

function createCompletionOption(option: string, doc: string): vscode.CompletionItem {
    let item = new vscode.CompletionItem(option);
    item.kind = vscode.CompletionItemKind.Value;
    item.documentation = doc;
    return item
}


export class Proto3CompletionItemProvider implements vscode.CompletionItemProvider {

    public provideCompletionItems(document: vscode.TextDocument,
                                  position: vscode.Position,
                                  token: vscode.CancellationToken)
            : Thenable<vscode.CompletionItem[]> {
        
        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
            let filename = document.fileName;
            let lineText = document.lineAt(position.line).text;

            if (lineText.match(/^\s*\/\//)) {
                return resolve([]);
            }

            let inString = false;
            if ((lineText.substring(0, position.character).match(/\"/g) || []).length % 2 === 1) {
                inString = true;
            }

            let suggestions = [];

            let textBeforeCursor = lineText.substring(0, position.character - 1)
            let scope = guessScope(document, position.line);
            //console.log(scope.syntax);
            //console.log(textBeforeCursor);

            switch (scope.kind) {
                case Proto3ScopeKind.Proto: {
                    if (textBeforeCursor.match(/^\s*\w*$/)) {
                        suggestions.push(kwSyntax);
                        suggestions.push(kwPackage);
                        suggestions.push(kwOption);
                        suggestions.push(kwImport);
                        suggestions.push(kwMessage);
                        suggestions.push(kwEnum);
                    } else if (textBeforeCursor.match(/^\s*option\s+\w*$/)) {
                        suggestions.push(...fileOptions);
                    }
                    break;
                }
                case Proto3ScopeKind.Message: {
                    if (textBeforeCursor.match(/^\s*\w*$/)) {
                        suggestions.push(kwOption);
                        suggestions.push(kwMessage);
                        suggestions.push(kwEnum);
                        suggestions.push(kwReserved);
                        if (scope.syntax == 2) {
                            suggestions.push(...fieldRules);
                        } else {
                            suggestions.push(fieldRules[0]);
                        }
                        suggestions.push(...scalaTypes);
                    } else if (textBeforeCursor.match(/(repeated|required|optional)\s*\w*$/)) {
                        suggestions.push(...scalaTypes);
                    } else if (textBeforeCursor.match(/^\s*option\s+\w*$/)) {
                        suggestions.push(...msgOptions);
                    } else if (textBeforeCursor.match(/.*\[.*/)) {
                        suggestions.push(...fieldOptions);
                        if (scope.syntax == 2) {
                            suggestions.push(fieldDefault);
                        }
                    }
                    break;
                }
                case Proto3ScopeKind.Enum: {
                    if (textBeforeCursor.match(/^\s*\w*$/)) {
                        suggestions.push(kwOption);
                    } else if (textBeforeCursor.match(/^\s*option\s+\w*$/)) {
                        suggestions.push(...enumOptions);
                    }
                    break;
                }
            }

            return resolve(suggestions);
        });
    }

}
