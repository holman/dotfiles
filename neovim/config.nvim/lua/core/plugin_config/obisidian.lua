vim.opt.conceallevel = 1


local go_day_back = function()
  local offset = 0

  return function()
    offset = offset - 1
    vim.cmd.ObsidianToday(offset)
  end
end

-- vim.keymap.set('n', '<leader>t', vim.cmd.ObsidianToday())
vim.keymap.set('n', '<leader>b', go_day_back())
-- vim.keymap.set('n', '<leader>y', vim.cmd.ObsidianYesterday())
