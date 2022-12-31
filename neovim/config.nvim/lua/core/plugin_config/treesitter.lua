require('nvim-treesitter.configs').setup({
  ensure_installed = { "elixir", "heex", "eex", "vim", "lua" },

  sync_install = false,
  auto_install = true,
  highlight = {
    enable = true,
  },
  indent = {
    enable = true,
  },
})
