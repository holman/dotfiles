# vscode-endwise

This is an extension that wisely adds the "end" keyword to code structures in languages like Ruby or Crystal while keeping the correct indentation levels. Inspired by tpope's [endwise.vim](https://github.com/tpope/vim-endwise).

![Endwise](https://github.com/kaiwood/vscode-endwise/raw/HEAD/./images/endwise.gif)

Just hit `enter` to get your block automagically closed. `ctrl+enter` / `cmd+enter` closed from the middle of the line as well.

## TODO

- [X] Wisely detect already closed blocks to skip additional "end"'s
- [ ] Add support for more languages:
  - [x]  Crystal
  - [ ]  Lua
  - [ ]  Bash
  - [ ]  Elixir
- [ ] Add a gif with code that actually makes sense 🙄
