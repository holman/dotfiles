import sublime, sublime_plugin

class XmlPrettifyCommand(sublime_plugin.TextCommand):
  def run(self, edit):
    import xml.dom.minidom
    import xml.parsers.expat
    selection = self.view.sel()[0]
    try:
      text = self.view.substr(selection).encode('utf-8')
      dom = xml.dom.minidom.parseString(text.replace('\n', '').replace('\t', ''))
      prettified = dom.toprettyxml()
    except xml.parsers.expat.ExpatError:
      return
    self.view.replace(edit, selection, prettified)
