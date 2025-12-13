#!/usr/bin/env sh

# Neovim installation script with LazyVim and Dracula theme
# This script sets up Neovim with LazyVim configuration

NVIM_CONFIG_DIR="$HOME/.config/nvim"

# Backup existing nvim config if it exists
if [ -d "$NVIM_CONFIG_DIR" ]; then
    echo "Backing up existing nvim config to $NVIM_CONFIG_DIR.backup"
    mv "$NVIM_CONFIG_DIR" "$NVIM_CONFIG_DIR.backup"
fi

# Clone LazyVim starter configuration
echo "Installing LazyVim..."
git clone https://github.com/LazyVim/starter "$NVIM_CONFIG_DIR"

# Remove the .git directory to make it a personal config
rm -rf "$NVIM_CONFIG_DIR/.git"

# Add Dracula theme to LazyVim config
echo "Configuring Dracula theme..."
cat >> "$NVIM_CONFIG_DIR/lua/plugins/colorscheme.lua" << 'EOF'
return {
  {
    "Mofiqul/dracula.nvim",
    name = "dracula",
    priority = 1000,
    config = function()
      require("dracula").setup({
        -- customize dracula color palette
        colors = {
          bg = "#282a36",
          fg = "#f8f8f2",
          selection = "#44475a",
          comment = "#6272a4",
          red = "#ff5555",
          orange = "#ffb86c",
          yellow = "#f1fa8c",
          green = "#50fa7b",
          purple = "#bd93f9",
          cyan = "#8be9fd",
          pink = "#ff79c6",
        },
        -- show the '~' characters after the end of lines
        show_end_of_buffer = true,
        -- transparent background
        transparent_bg = true,
        -- lualine bg color
        lualine_bg_color = "#44475a",
        -- set italic comments
        italic_comment = true,
        -- overrides the default highlights with new highlight table
        overrides = {},
      })
    end,
  },
}
EOF

# Set Dracula as the default colorscheme
cat > "$NVIM_CONFIG_DIR/lua/config/options.lua" << 'EOF'
-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here

-- Set colorscheme
vim.opt.termguicolors = true
vim.cmd.colorscheme "dracula"

-- Additional options
vim.opt.relativenumber = true
vim.opt.wrap = false
vim.opt.scrolloff = 8
vim.opt.sidescrolloff = 8
EOF

echo "Neovim with LazyVim and Dracula theme installed successfully!"
echo "Run 'nvim' to start using your new configuration."