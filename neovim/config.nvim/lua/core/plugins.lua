
vim.cmd([[
  augroup packer_user_config
    autocmd!
    autocmd BufWritePost plugins.lua source <afile> | PackerSync
  augroup end
]])

local ensure_packer = function()
  local fn = vim.fn
  local install_path = fn.stdpath('data')..'/site/pack/packer/start/packer.nvim'
  if fn.empty(fn.glob(install_path)) > 0 then
    fn.system({'git', 'clone', '--depth', '1', 'https://github.com/wbthomason/packer.nvim', install_path})
    vim.cmd [[packadd packer.nvim]]
    return true
  end
  return false
end

local packer_bootstrap = ensure_packer()

return require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'

  -- Git command integration
  use 'tpope/vim-fugitive'

  -- Smooth code commenting
  use 'terrortylor/nvim-comment'

  -- Vim buffer management
  use 'theprimeagen/harpoon'

  -- Color theme
  use 'ellisonleao/gruvbox.nvim'

  -- Replacement for Nerdtree + icons
  use 'nvim-tree/nvim-tree.lua'
  use 'nvim-tree/nvim-web-devicons'

  -- Beautiful status line
  use 'nvim-lualine/lualine.nvim'

  -- Treesitter for syntax highlighting and auto indentation
  use 'nvim-treesitter/nvim-treesitter'
  -- use 'tpope/vim-endwise'
  -- use 'elixir-editors/vim-elixir'
  -- use 'folke/which-key.nvim'

  -- LSP CONFIGURATION --
  use {
    -- Main LSP plugin allowing easy config of LSP servers
    'neovim/nvim-lspconfig',

    requires = {
      -- LSP package manager for LSP servers
      'williamboman/mason.nvim',
      -- Bridges mason with nvim-lspconfig
      'williamboman/mason-lspconfig',
      -- Additional lua configuration, makes nvim stuff amazing
      -- 'folke/neodev.nvim',
    }
  }

  -- Completion framework
  use {
    'hrsh7th/nvim-cmp',

    requires = {
      'hrsh7th/cmp-nvim-lsp', -- Completion source for nvims builtin language server client
      'L3MON4D3/LuaSnip',
      'saadparwaiz1/cmp_luasnip',
      -- 'hrsh7th/cmp-buffer',
      -- 'hrsh7th/cmp-path'
      -- 'hrsh7th/cmp-cmdline'
    }
  }

  -- Get this debug adapter (DAP) setup for Elixir since nvim-lspconfig doesn't support Elixir DAP
  -- use 'mfussenegger/nvim-dap'

  use {
    'nvim-telescope/telescope.nvim',
    branch = '0.1.x',
    requires = {
      { 'nvim-lua/plenary.nvim' },
      { 'BurntSushi/ripgrep' },
      { 'nvim-telescope/telescope-fzf-native.nvim'},
      { 'sharkdp/fd' },
    }
  }

  -- Automatically set up configs after cloning packer.nvim
  if packer_bootstrap then
    require('packer').sync()
  end
end)
