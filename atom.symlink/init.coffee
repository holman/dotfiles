path = require 'path'

atom.workspace.observeTextEditors (editor) ->
  if path.extname(editor.getPath()) is '.md'
    editor.setSoftWrap(true)
