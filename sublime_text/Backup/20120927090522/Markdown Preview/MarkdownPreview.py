import sublime, sublime_plugin
import desktop
import tempfile
import markdown2
import os
import sys
import re
import json
import urllib2

settings = sublime.load_settings('MarkdownPreview.sublime-settings')


def getTempMarkdownPreviewPath(view):
    " return a permanent full path of the temp markdown preview file "
    tmp_filename = '%s.html' % view.id()
    tmp_fullpath = os.path.join(tempfile.gettempdir(), tmp_filename)
    return tmp_fullpath


class MarkdownPreviewListener(sublime_plugin.EventListener):
    """ update the output html when markdown file has already been converted once """

    def on_post_save(self, view):
        if view.file_name().endswith(('.md', '.markdown', '.mdown')):
            temp_file = getTempMarkdownPreviewPath(view)
            if os.path.isfile(temp_file):
                # reexec markdown conversion
                view.run_command('markdown_preview', {'target': 'disk'})
                sublime.status_message('Markdown preview file updated')


class MarkdownCheatsheetCommand(sublime_plugin.TextCommand):
    """ open our markdown cheat sheet in ST2"""
    def run(self, edit):
        cheatsheet = os.path.join(sublime.packages_path(), 'Markdown Preview', 'sample.md')
        self.view.window().open_file(cheatsheet)
        sublime.status_message('Markdown cheat sheet opened')


class MarkdownPreviewCommand(sublime_plugin.TextCommand):
    """ preview file contents with python-markdown and your web browser"""

    def getCSS(self):
        config_parser = settings.get('parser')
        config_css = settings.get('css')

        if config_css and config_css != 'default':
            return "<link href='%s' rel='stylesheet' type='text/css'>" % config_css
        else:
            css_filename = 'markdown.css'
            if config_parser and config_parser == 'github':
                css_filename = 'github.css'
            # path via package manager
            css_path = os.path.join(sublime.packages_path(), 'Markdown Preview', css_filename)
            if not os.path.isfile(css_path):
                # path via git repo
                css_path = os.path.join(sublime.packages_path(), 'sublimetext-markdown-preview', css_filename)
                if not os.path.isfile(css_path):
                    sublime.error_message('markdown.css file not found!')
                    raise Exception("markdown.css file not found!")
            styles = u"<style>%s</style>" % open(css_path, 'r').read().decode('utf-8')
        return styles

    def postprocessor(self, html):
        # fix relative paths in images/scripts
        def tag_fix(match):
            tag, src = match.groups()
            filename = self.view.file_name()
            if filename:
                if not src.startswith(('file://', 'https://', 'http://', '/')):
                    abs_path = u'file://%s/%s' % (os.path.dirname(filename), src)
                    tag = tag.replace(src, abs_path)
            return tag
        RE_SOURCES = re.compile("""(?P<tag><(?:img|script)[^>]+src=["'](?P<src>[^"']+)[^>]*>)""")
        html = RE_SOURCES.sub(tag_fix, html)
        return html

    def run(self, edit, target='browser'):
        region = sublime.Region(0, self.view.size())
        encoding = self.view.encoding()
        if encoding == 'Undefined':
            encoding = 'utf-8'
        elif encoding == 'Western (Windows 1252)':
            encoding = 'windows-1252'
        contents = self.view.substr(region)

        config_parser = settings.get('parser')

        markdown_html = u'cannot convert markdown'
        if config_parser and config_parser == 'github':
            sublime.status_message('converting markdown with github API...')
            try:
                contents = contents.replace('%', '')    # see https://gist.github.com/3742011
                data = json.dumps({"text": contents, "mode": "gfm"})
                url = "https://api.github.com/markdown"
                markdown_html = urllib2.urlopen(url, data).read().decode('utf-8')
            except urllib2.HTTPError:
                sublime.error_message('github API responded in an unfashion way :/')
            except urllib2.URLError:
                sublime.error_message('cannot use github API to convert markdown. SSL is not included in your Python installation')
            except:
                sublime.error_message('cannot use github API to convert markdown. Please check your settings.')
            else:
                sublime.status_message('converted markdown with github API successfully')
        else:
            # convert the markdown
            markdown_html = markdown2.markdown(contents, extras=['footnotes', 'toc', 'fenced-code-blocks', 'cuddled-lists', 'code-friendly'])
            # postprocess the html
            markdown_html = self.postprocessor(markdown_html)

        # check if LiveReload ST2 extension installed
        livereload_installed = ('LiveReload' in os.listdir(sublime.packages_path()))

        # build the html
        html_contents = u'<!DOCTYPE html>'
        html_contents += '<html><head><meta charset="%s">' % encoding
        html_contents += self.getCSS()
        if livereload_installed:
            html_contents += '<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':35729/livereload.js?snipver=1"></\' + \'script>\')</script>'
        html_contents += '</head><body>'
        html_contents += markdown_html
        html_contents += '</body>'

        if target in ['disk', 'browser']:
            # update output html file
            tmp_fullpath = getTempMarkdownPreviewPath(self.view)
            tmp_html = open(tmp_fullpath, 'w')
            tmp_html.write(html_contents.encode(encoding))
            tmp_html.close()
            # todo : livereload ?
            if target == 'browser':
                config_browser = settings.get('browser')
                if config_browser and config_browser != 'default':
                    cmd = '"%s" %s' % (config_browser, tmp_fullpath)
                    if sys.platform == 'darwin':
                        cmd = "open -a %s" % cmd
                    print "Markdown Preview: executing", cmd
                    result = os.system(cmd)
                    if result != 0:
                        sublime.error_message('cannot execute "%s" Please check your Markdown Preview settings' % config_browser)
                    else:
                        sublime.status_message('Markdown preview launched in %s' % config_browser)
                else:
                    desktop.open(tmp_fullpath)
                    sublime.status_message('Markdown preview launched in default html viewer')
        elif target == 'sublime':
            new_view = self.view.window().new_file()
            new_edit = new_view.begin_edit()
            new_view.insert(new_edit, 0, html_contents)
            new_view.end_edit(new_edit)
            sublime.status_message('Markdown preview launched in sublime')
