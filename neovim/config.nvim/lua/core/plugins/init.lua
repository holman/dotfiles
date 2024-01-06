
return {
  -- Git command integration
  'tpope/vim-fugitive',
  {
    'kdheepak/lazygit.nvim', -- Lazygit :/
    dependencies = {
      'nvim-lua/plenary.nvim',
    },
  },

  -- Smooth code commenting
  'terrortylor/nvim-comment',

  -- Vim buffer management
  'theprimeagen/harpoon',

  -- vim-tmux-navigator
  'christoomey/vim-tmux-navigator',

  -- Color theme
  { "ellisonleao/gruvbox.nvim", priority = 1000 , config = true},
  'tomasr/molokai',
  'tanvirtin/monokai.nvim',
  'sainnhe/everforest',

  -- Replacement for Nerdtree + icons
  {
    'nvim-tree/nvim-tree.lua',
    version = "*",
    lazy = false,
    dependencies = {
      'nvim-tree/nvim-web-devicons',
    },
    config = function()
      require("nvim-tree").setup {}
    end,
  },

  -- Beautiful status line
  'nvim-lualine/lualine.nvim',

  -- Treesitter for syntax highlighting and vim-elixir for autoindenting
  'elixir-editors/vim-elixir', -- Use vim-elixir for autoindenting but not syntax highlighting
  'nvim-treesitter/nvim-treesitter', -- Use treesitter for syntax highlighting but not autoindenting
  -- 'tpope/vim-endwise',
  -- 'folke/which-key.nvim',
  -- require('which-key').setup({})

  -- LSP CONFIGURATION --
  {
    -- Main LSP plugin allowing easy config of LSP servers
    'neovim/nvim-lspconfig',

    dependencies = {
      -- LSP package manager for LSP servers
      'williamboman/mason.nvim',
      -- Bridges mason with nvim-lspconfig
      'williamboman/mason-lspconfig',
      -- Additional lua configuration, makes nvim stuff amazing
      -- 'folke/neodev.nvim',
    }
  },

  -- Completion framework
  {
    'hrsh7th/nvim-cmp',

    dependencies = {
      'hrsh7th/cmp-nvim-lsp', -- Completion source for nvims builtin language server client
      'hrsh7th/cmp-nvim-lua',
      'L3MON4D3/LuaSnip',
      'saadparwaiz1/cmp_luasnip',
      'hrsh7th/cmp-buffer',
      'hrsh7th/cmp-path',
      'hrsh7th/cmp-cmdline',
      'onsails/lspkind.nvim',
      'aca/emmet-ls', -- HTML Snippets - https://docs.emmet.io/cheat-sheet/
      -- https://github.com/rafamadriz/friendly-snippets/blob/main/snippets/elixir.json
      -- https://github.com/rafamadriz/friendly-snippets/blob/main/snippets/eelixir.json
      'rafamadriz/friendly-snippets',
    }
  },

  -- Get this debug adapter (DAP) setup for Elixir since nvim-lspconfig doesn't support Elixir DAP
  -- 'mfussenegger/nvim-dap',

  {
    'nvim-telescope/telescope.nvim',
    branch = '0.1.x',
    dependencies = {
      { 'nvim-lua/plenary.nvim' },
      { 'BurntSushi/ripgrep' },
      { 'nvim-telescope/telescope-fzf-native.nvim', build = 'make' },
      { 'sharkdp/fd' },
    }
  },

}
