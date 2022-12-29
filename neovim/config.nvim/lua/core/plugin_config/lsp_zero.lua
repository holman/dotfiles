vim.opt.signcolumn = 'yes' -- Reserve space for diagnostic icons

local lsp = require('lsp-zero')
lsp.preset('recommended')

lsp.ensure_installed({
  'tsserver',
  'eslint',
  'elixirls',
  'sumneko_lua',
})

lsp.nvim_workspace()

lsp.setup()


-- require('mason').setup()
-- require('mason-lspconfig').setup({
--   ensure_installed = {
--     'sumneko_lua',
--     'elixirls',
--   }
-- })
-- 
-- require('lspconfig').sumneko_lua.setup({
--   settings = {
--     Lua = {
--       diagnostics = {
--         globals = {'vim'},
--       },
--     },
--   },
-- })
-- 
-- require('lspconfig').elixirls.setup({})
