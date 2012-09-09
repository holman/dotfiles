import sublime
import sublime_plugin

import re
import os
import sys
import subprocess
import urllib
import urllib2
import base64
from collections import defaultdict

############### CONSTANTS ###############

supported_options = [
    'add-xml-decl',
    'add-xml-space',
    'alt-text',
    'anchor-as-name',
    'assume-xml-procins',
    'bare',
    'clean',
    'css-prefix',
    'decorate-inferred-ul',
    'doctype DocType auto',
    'drop-empty-paras',
    'drop-font-tags',
    'drop-proprietary-attributes',
    'enclose-block-text',
    'enclose-text',
    'escape-cdata',
    'fix-backslash',
    'fix-bad-comments',
    'fix-uri',
    'hide-comments',
    'hide-endtags',
    'indent-cdata',
    'input-xml',
    'join-classes',
    'join-styles',
    'literal-attributes',
    'logical-emphasis',
    'lower-literals',
    'merge-divs',
    'merge-spans',
    'ncr',
    'new-blocklevel-tags',
    'new-empty-tags',
    'new-inline-tags',
    'new-pre-tags',
    'numeric-entities',
    'output-html',
    'output-xhtml',
    'output-xml',
    'preserve-entities',
    'quote-ampersand',
    'quote-marks',
    'quote-nbsp',
    'repeated-attributes',
    'replace-color',
    'show-body-only',
    'uppercase-attributes',
    'uppercase-tags',
    'word-2000',
    'break-before-br',
    'indent',
    'indent-attributes',
    'indent-spaces',
    'markup',
    'punctuation-wrap',
    'sort-attributes',
    'split',
    'tab-size',
    'vertical-space',
    'wrap',
    'wrap-asp',
    'wrap-attributes',
    'wrap-jste',
    'wrap-php',
    'wrap-script-literals',
    'wrap-sections',
    'ascii-chars',
    'char-encoding',
    'input-encoding',
    'language',
    'newline',
    'output-bom',
    'output-encoding',
    'error-file',
    'force-output',
    'gnu-emacs',
    'gnu-emacs-file',
    'keep-time',
    'output-file',
    'tidy-mark',
    'quiet',
    'write-back',
]

re_ID = re.compile(r"""<[^>]*?id\s*=\s*("|')(.*?)("|')[^>]*?>""", re.DOTALL | re.MULTILINE)

# Path to plugin, script and libraries.
pluginpath = os.path.join(sublime.packages_path(), 'HtmlTidy')
scriptpath = os.path.join(pluginpath, 'tidy.php')

############### FUNCTIONS ###############


def tidy_string(input_string, command):

    # call webservice
    if 'webservice' == command[0]:

        url = 'http://tidy.welovewordpress.de/webservice/'
        values = { 'content' : base64.b64encode( input_string.encode('utf8') ), 
                   'arguments' : str(command) }

        data = urllib.urlencode( values )
        req = urllib2.Request(url, data, headers={"Accept" : "text/html"} )
        response = urllib2.urlopen(req)
        returned_content = response.read()
        # print 'HtmlTidy: returned_content ' + returned_content
        tidied = returned_content
        # error = 'the web api responded: ' + str(returned_content)
        error = ''
        returncode = 0
        return tidied, error, returncode

    p = subprocess.Popen(
        command,
        bufsize=-1,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        shell=True,
        universal_newlines=True
    )

    tidied, error = p.communicate(input_string.encode('utf8'))
    return tidied, error, p.returncode


def remove_duplicate_ids(html):
    'Removes duplicated IDs in the parsed markup.'
    'Also adapted from the Sublime Text 1 webdevelopment package.'
    idsn = defaultdict(int)
    matches = []

    for m in re_ID.finditer(html):
        id = m.group(2)
        idsn[id] += 1
        matches.append(m)

    for match in reversed(matches):
        id = match.group(2)

        n = idsn[id]
        idsn[id] -= 1

        if n > 1:
            start, end = match.span(2)
            html = "%s%s%s%s" % (html[:start], id, str(n), html[end:])

    return html


def check_php_version(command):

    p = subprocess.Popen(
        command,
        bufsize=-1,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        shell=True,
        universal_newlines=True
    )

    response, error = p.communicate()
    print "HtmlTidy: response: " + response;
    print "HtmlTidy: p.returncode: " + p.returncode;
    print "HtmlTidy: error: " + error;
    
    return false


def find_tidier():
    # ' Try bundled tidy (if windows), then Tidy in path, then php.'
    # if sublime.platform() == 'windows':
    #     try:
    #         tidypath = os.path.normpath(pluginpath + '/win/tidy.exe')
    #         subprocess.call([tidypath, "-v"])
    #         print "HTMLTidy: using Tidy found here: " + tidypath
    #         return tidypath, 'list'
    #     except OSError:
    #         print "HTMLTidy: Didn't find tidy.exe in " + pluginpath
    #         pass

    # 
    try:
        subprocess.call(['php', '-v'])

        print "HTMLTidy: Checking PHP Tidy module..."
        retval = subprocess.call('php "' + os.path.normpath(scriptpath) + '" --selfcheck', shell = True)

        if retval == 0:
            print "HTMLTidy: Using PHP Tidy module."
            # print "HTMLTidy: retval: " + str(retval)
            return 'php "' + os.path.normpath(scriptpath) + '"', 'string'
        else:
            print "HTMLTidy: Your PHP version doesn't include Tidy support"
            # print "HTMLTidy: retval: " + str(retval)
            pass

    except OSError:
        print "HTMLTidy: Not using PHP"
        pass

    return "webservice", 'list'

    # try:
    #     subprocess.call(['tidy', '-v'])
    #     print "HTMLTidy: using Tidy found in PATH"
    #     return "tidy", 'string'
    # except OSError:
    #     print "HTMLTidy: Didn't find Tidy in the PATH."
    #     pass

    raise OSError


def fixup(string):
    'Remove double newlines & decode text.'
    return re.sub(r'\r\n|\r', '\n', string.decode('utf-8'))


def compile_args(args, script, style):
    'Take a list of tuples and present it as either a list of a string in --opt=arg style'
    if style == 'string':
        return script + ' ' + ' '.join([a[0] + '=' + a[1] for a in args])
    if style == 'list':
        output = []
        for a in args:
            output.extend(a)
        return [script] + output


def get_args(args):
    'Builds command line arguments.'

    # load HtmlTidy settings
    settings = sublime.load_settings('HtmlTidy.sublime-settings')

    # leave out default values
    for option in supported_options:
        custom_value = settings.get(option)

        # If custom value isn't set, ignore that setting.
        if custom_value is None:
            continue

        if custom_value == True:
            custom_value = 1
        if custom_value == False:
            custom_value = 0

        # print "HtmlTidy: setting " + option + ": " + custom_value
        args += [('--' + option, str(custom_value))]

    return args


def entab(temp, tab_width=4, all=0):
    'Convert spaces to tabs'
    # http://code.activestate.com/recipes/66433-change-tabsspaces-with-regular-expressions/
    # if all is true, every time tab_width number of spaces are found next
    # to each other, they are converted to a tab.  If false, only those at
    # the beginning of the line are converted.  Default is false.

    if all:
        temp = re.sub(r" {" + repr(tab_width) + r"}", r"\t", temp)
    else:
        patt = re.compile(r"^ {" + repr(tab_width) + r"}", re.M)
        temp, count = patt.subn(r"\t", temp)
        i = 1
        while count > 0:
             # this only loops a few times, at most six or seven times on
             # heavily indented code
            subpatt = re.compile(r"^\t{" + repr(i) + r"} {" + repr(tab_width) + r"}", re.M)
            temp, count = subpatt.subn("\t" * (i + 1), temp)
            i += 1
    return temp

############### CLASS ###############


class HtmlTidyCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        print('HtmlTidy: invoked on file: %s' % (self.view.file_name()))

        try:
            script, arg_type = find_tidier()
        except OSError:
            print "HTMLTidy: Couldn't find Tidy or PHP. Stopping without Tidying anything."
            return

        tab_size = int(self.view.settings().get('tab_size', 4))
        # print('HtmlTidy: tab_size: %s' % (tab_size))
        args = [('--indent-spaces', str(tab_size))]
        args = [('--tab-size', str(tab_size))]

        # Get arguments from config files.
        # This extends the argument just given, so that a user-given value for tab_size takes precedence.
        args = get_args(args)

        allow_dupe_ids = self.view.settings().get('allow-duplicate-ids', False)

        # Get current selection(s).
        if not self.view.sel()[0].empty():
            # If selection, then make sure not to add body tags and the like.
            args += [('--show-body-only', '1')]

        else:
            # If no selection, get the entire view.
            self.view.sel().add(sublime.Region(0, self.view.size()))

        command = compile_args(args, script, style=arg_type)
        print 'HtmlTidy: ' + str(command)
        #print "HtmlTidy: Passing this script and arguments: " + script + " " + str(args)
        for sel in self.view.sel():

            tidied, err, retval = tidy_string(self.view.substr(sel), command)

            err = fixup(err)

            if tidied and (retval == 0 or retval == 1):
                # convert spaces to tabs if view settings say so
                if (not self.view.settings().get('translate_tabs_to_spaces')):
                    tidied = entab(tidied, tab_size)

                if allow_dupe_ids == False:
                    tidied = remove_duplicate_ids(tidied)

                # write new content back to buffer
                self.view.replace(edit, sel, fixup(tidied))

                if retval == 1:
                    print "HTMLTidy: Tidy had some warnings for you:\n" + err

            else:
                print "HTMLTidy experienced an error. Opening up a new file to show you."
                # Again, adapted from the Sublime Text 1 webdevelopment package
                nv = self.view.window().new_file()
                nv.set_scratch(1)
                # Append the given command to the error message.
                nv.insert(edit, 0, err + "\n" + str(command))
                nv.set_name('HTMLTidy: Tidy errors')
