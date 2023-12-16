vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

require("nvim-tree").setup({
  -- view.mappings doesnt' exist anymore. Use <c-]> on any directory to cd the context there
  -- view = {
  --   mappings = {
  --     list = {
  --       { key = "u", action = "dir_up" },
  --     },
  --   },
  -- },
})

vim.keymap.set('n', '<c-n>', ':NvimTreeFindFileToggle<CR>')
