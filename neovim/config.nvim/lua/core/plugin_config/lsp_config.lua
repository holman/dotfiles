vim.opt.signcolumn = 'yes' -- Reserve space for diagnostic icons

-- Broadcast nvim-cmp additional completion capabilities to all lsp servers
local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities.textDocument.completion.completionItem.snippetSupport = true
capabilities = require('cmp_nvim_lsp').default_capabilities(capabilities)

require('mason').setup()

require('mason-lspconfig').setup({
  ensure_installed = {
    'sumneko_lua',
    'elixirls',
    'emmet_ls',
  }
})


-- LSP server configurations by language
-- https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md

require('lspconfig').elixirls.setup({
  -- I think that mason-lspconfig sets this up already. I didn't have to set the path
  -- cmd = { "/Users/kyle/.local/share/nvim/mason/packages/elixir-ls/language_server.sh" };
  capabilities = capabilities,
})

require('lspconfig').sumneko_lua.setup({
  capabilities = capabilities,
  settings = {
    Lua = {
      diagnostics = {
        globals = {'vim'},
      },
    },
  },
})

require('lspconfig').emmet_ls.setup({
  capabilities = capabilities,
  filetypes = { 'html', 'heex', 'leex', 'css', 'sass', 'scss', 'less'},
  init_options = {
    html = {
      options = {
        -- For possible options, see: https://github.com/emmetio/emmet/blob/master/src/config.ts#L79-L267
        ["bem.enabled"] = true,
      }
    }
  }
})

-- nvim-cmp setup
local cmp = require 'cmp'
local luasnip = require 'luasnip'
local lspkind = require 'lspkind'

cmp.setup {
  snippet = {
    expand = function(args)
      luasnip.lsp_expand(args.body)
    end,
  },
  mapping = cmp.mapping.preset.insert {
    ['<C-d>'] = cmp.mapping.scroll_docs(-4),
    ['<C-f>'] = cmp.mapping.scroll_docs(4),
    ['<C-Space>'] = cmp.mapping.complete(),
    ["<C-e>"] = cmp.mapping.close(), -- Close cmp window
    ['<C-y>'] = cmp.mapping.confirm {
      -- behavior = cmp.ConfirmBehavior.Replace,
      select = true,
    },
    ['<Tab>'] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.select_next_item()
      elseif luasnip.expand_or_jumpable() then
        luasnip.expand_or_jump()
      else
        fallback()
      end
    end, { 'i', 's' }),
    ['<S-Tab>'] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.select_prev_item()
      elseif luasnip.jumpable(-1) then
        luasnip.jump(-1)
      else
        fallback()
      end
    end, { 'i', 's' }),
  },
  sources = {
    { name = 'luasnip' },
    { name = 'nvim_lua' },
    { name = 'nvim_lsp' },
    { name = 'buffer', keyword_length = 5, max_item_count = 3 },
  },
  formatting = {
    format = lspkind.cmp_format({
      with_text = true,
      menu = {
        buffer = "[buf]",
        nvim_lsp = "[LSP]",
        nvim_lua = "[nvim]",
        path = "[path]",
        luasnip = "[snip]",
        cmdline = "[cmd]",
      },
      mode = 'symbol', -- show only symbol annotations
      maxwidth = 50, -- prevent the popup from showing more than provided characters 
      ellipsis_char = '...', -- when popup menu exceed maxwidth
    })
  },
  experimental = {
    ghost_text = true,
  },
}

luasnip.filetype_extend("elixir", {"elixir"})
luasnip.filetype_extend("heex", {"eelixir"})
luasnip.filetype_extend("leex", {"eelixir"})

require("luasnip.loaders.from_vscode").lazy_load()
