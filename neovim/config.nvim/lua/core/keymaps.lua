vim.g.mapleader = ' '
vim.g.maplocalleader = ' '

vim.opt.backspace = '2'
vim.opt.showcmd = true
vim.opt.laststatus = 2
vim.opt.autowrite = true
vim.opt.cursorline = true
vim.opt.autoread = true

-- Allow cut and paste between tmux and terminal sessions using yank and put
vim.opt.clipboard = 'unnamed'

-- use spaces for tabs
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.shiftround = true
vim.opt.expandtab = true

-- window settings
vim.wo.number = true

-- LazyGit
vim.keymap.set('n', '<leader>gg', ':LazyGit<CR>')

-- Window navigation
vim.keymap.set('n', '<c-j>', '<c-w>j')
vim.keymap.set('n', '<c-k>', '<c-w>k')
vim.keymap.set('n', '<c-l>', '<c-w>l')
vim.keymap.set('n', '<c-h>', '<c-w>h')
vim.keymap.set('n', '<c-m>', '<c-w>=')
vim.keymap.set('n', '<CR>', '<c-w>_<c-w>|')

-- Tab navigation
vim.keymap.set('n', '<c-t>h', ':tabr<cr>')
vim.keymap.set('n', '<c-t>l', ':tabl<cr>')

-- HTML
vim.keymap.set('n', 'gho', '^lct>') -- create open tag from copied tag
vim.keymap.set('n', 'ghc', 'yyp^a/<esc>Eldt>') -- create closing tag from current tag
