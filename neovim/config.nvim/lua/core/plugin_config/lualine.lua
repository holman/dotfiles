require('lualine').setup {
  options = {
    icons_enabled = true,
    theme = 'gruvbox',
    -- theme = 'molokai',
    -- theme = 'monokai',
    -- theme = 'monokai_ristretto',
    -- theme = 'everforest',
  },
  sections = {
    lualine_a = {
      {
        'filename',
        path = 1,
      }
    }
  }
}
