require('nvim-treesitter.configs').setup({
  ensure_installed = { "elixir", "vim", "lua" },

  sync_install = false,
  auto_install = true,
  highlight = {
    enable = true,
  },
})
