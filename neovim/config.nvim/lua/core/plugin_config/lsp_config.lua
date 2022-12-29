require('mason').setup()
require('mason-lspconfig').setup({
  ensure_installed = {
    'sumneko_lua',
    'elixirls',
  }
})

require('lspconfig').sumneko_lua.setup({})
require('lspconfig').elixirls.setup({})
