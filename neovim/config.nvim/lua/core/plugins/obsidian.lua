
local offset = 0

local go_day_back = function()
  return function()
    offset = offset - 1
    vim.cmd.ObsidianToday(offset)
  end
end

local go_to_today = function()
  return function()
    offset = 0
    vim.cmd.ObsidianToday(offset)
  end
end

local open_link_vsplit = function()
  return function()
    vim.cmd.ObsidianFollowLink("vsplit")
  end
end

-- local local_smart_action = function()
--   return function()
--     if require('obsidian').util.cursor_on_markdown_link(nil, nil, true) then
--       vim.print("In local if")
--       return vim.cmd.ObsidianFollowLink()
--     end
--
--     vim.print("Passed local if")
--     return vim.cmd.ObsidianToggleCheckbox()
--   end
-- end
--
-- local obsidian_quick_switch = function()
--   return function()
--     vim.cmd.ObsidianQuickSwitch()
--   end
-- end
--
-- local obsidian_search = function()
--   return function()
--     vim.cmd.ObsidianSearch()
--   end
-- end
--
-- local obsidian_new = function()
--   return function()
--     vim.cmd.ObsidianNew()
--   end
-- end
--
-- local obsidian_link = function()
--   return function()
--     vim.cmd.ObsidianLink()
--   end
-- end
--
-- local obsidian_link_new = function()
--   return function()
--     vim.cmd.ObsidianLinkNew()
--   end
-- end
--
-- local obsidian_all_links = function()
--   return function()
--     vim.cmd.ObsidianLinks()
--   end
-- end
--
-- local obsidian_paste_img = function()
--   return function()
--     vim.cmd.ObsidianPasteImg()
--   end
-- end

return {
  "epwalsh/obsidian.nvim",
  version = "*",  -- recommended, use latest release instead of latest commit
  lazy = true,
  ft = "markdown",
  -- Replace the above line with this if you only want to load obsidian.nvim for markdown files in your vault:
  -- event = {
  --   -- If you want to use the home shortcut '~' here you need to call 'vim.fn.expand'.
  --   -- E.g. "BufReadPre " .. vim.fn.expand "~" .. "/my-vault/**.md"
  --   "BufReadPre path/to/my-vault/**.md",
  --   "BufNewFile path/to/my-vault/**.md",
  -- },
  dependencies = {
    -- Required.
    "nvim-lua/plenary.nvim",
    "hrsh7th/nvim-cmp",
    "nvim-telescope/telescope.nvim",
    "nvim-treesitter/nvim-treesitter",

    -- see below for full list of optional dependencies 👇
  },
  opts = {
    workspaces = {
      {
        name = "personal",
        path = "~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal",
        notes_subdir = "00-inbox",
      },
      {
        name = "work",
        path = "~/Library/Mobile Documents/iCloud~md~obsidian/Documents/PDQ",
        notes_subdir = "00-inbox",
      },
    },

    notes_subdir = "00-inbox",

    daily_notes = {
      folder = "dailies",
      -- template = "daily_template"
    },

    templates = {
      subdir = "04-templates",
    },

    completion = {
      nvim_cmp = true,
      min_chars = 2,
    },
    ui = {
      enable = true,  -- set to false to disable all additional syntax features
      update_debounce = 200,  -- update delay after a text change (in milliseconds)
      -- Define how various check-boxes are displayed
      checkboxes = {
        -- NOTE: the 'char' value has to be a single character, and the highlight groups are defined below.
        [" "] = { char = "󰄱", hl_group = "ObsidianTodo" },
        ["x"] = { char = "", hl_group = "ObsidianDone" },
        [">"] = { char = "", hl_group = "ObsidianRightArrow" },
        ["~"] = { char = "󰰱", hl_group = "ObsidianTilde" },
        -- Replace the above with this if you don't have a patched font:
        -- [" "] = { char = "☐", hl_group = "ObsidianTodo" },
        -- ["x"] = { char = "✔", hl_group = "ObsidianDone" },

        -- You can also add more custom ones...
      },
      -- Use bullet marks for non-checkbox lists.
      bullets = { char = "•", hl_group = "ObsidianBullet" },
      external_link_icon = { char = "", hl_group = "ObsidianExtLinkIcon" },
      -- Replace the above with this if you don't have a patched font:
      -- external_link_icon = { char = "", hl_group = "ObsidianExtLinkIcon" },
      reference_text = { hl_group = "ObsidianRefText" },
      highlight_text = { hl_group = "ObsidianHighlightText" },
      tags = { hl_group = "ObsidianTag" },
      block_ids = { hl_group = "ObsidianBlockID" },
      hl_groups = {
        -- The options are passed directly to `vim.api.nvim_set_hl()`. See `:help nvim_set_hl`.
        ObsidianTodo = { bold = true, fg = "#f78c6c" },
        ObsidianDone = { bold = true, fg = "#89ddff" },
        ObsidianRightArrow = { bold = true, fg = "#f78c6c" },
        ObsidianTilde = { bold = true, fg = "#ff5370" },
        ObsidianBullet = { bold = true, fg = "#89ddff" },
        ObsidianRefText = { underline = true, fg = "#c792ea" },
        ObsidianExtLinkIcon = { fg = "#c792ea" },
        ObsidianTag = { italic = true, fg = "#89ddff" },
        ObsidianBlockID = { italic = true, fg = "#89ddff" },
        ObsidianHighlightText = { bg = "#75662e" },
      },
    },
    picker = {
      -- Set your preferred picker. Can be one of 'telescope.nvim', 'fzf-lua', or 'mini.pick'.
      name = "telescope.nvim",
      -- Optional, configure key mappings for the picker. These are the defaults.
      -- Not all pickers support all mappings.
      mappings = {
        -- Create a new note from your query.
        new = "<C-x>",
        -- Insert a link to the selected note.
        insert_link = "<C-l>",
      },
    },
    mappings = {
      -- Overrides the 'gf' mapping to work on markdown/wiki links within your vault.
      ["gf"] = {
        action = function()
          return require("obsidian").util.gf_passthrough()
        end,
        opts = { noremap = false, expr = true, buffer = true },
      },
      -- Toggle check-boxes.
      ["<leader>c"] = {
        action = function()
          return require("obsidian").util.toggle_checkbox()
        end,
        opts = { buffer = true },
      },
      -- Smart action depending on context, either follow link or toggle checkbox.
      ["<cr>"] = {
        action = function()
          return require("obsidian").util.smart_action()
        end,
        opts = { buffer = true, expr = true },
      },
      ["<leader>t"] = {
        action = go_to_today(),
        opts = { buffer = true },
      },
      ["<leader>b"] = {
        action = go_day_back(),
        opts = { buffer = true },
      },
      ["<leader>bl"] = {
        action = function() return "<cmd>ObsidianBacklinks<CR>" end,
        opts = { buffer = true, expr = true },
      },
      ["<leader>oq"] = {
        action = function() return "<cmd>ObsidianQuickSwitch<CR>" end,
        opts = { buffer = true, expr = true },
      },
      ["<leader>os"] = {
        action = function() return "<cmd>ObsidianSearch<CR>" end,
        opts = { buffer = true, expr = true },
      },
      ["<leader>on"] = {
        action = function() return "<cmd>ObsidianNew<CR>" end,
        opts = { buffer = true, expr = true },
      },
      ["<leader>ov"] = { -- This doesnt work will need to create local func
        action = function() return "<cmd>ObsidianFollowLink vsplit<CR>" end,
        opts = { buffer = true, expr = true },
      },
      ["<leader>ol"] = {
        action = function() return "<cmd>ObsidianLink<CR>" end,
        opts = { buffer = true, expr = true },
      },
      ["<leader>o/"] = {
        action = function() return "<cmd>ObsidianLinkNew<CR>" end,
        opts = { buffer = true, expr = true },
      },
      ["<leader>oa"] = {
        action = function() return "<cmd>ObsidianLinks<CR>" end,
        opts = { buffer = true, expr = true },
      },
      ["<leader>oi"] = {
        action = function() return "<cmd>ObsidianPasteImg<CR>" end,
        opts = { buffer = true, expr = true },
      },
    },

  },
}
