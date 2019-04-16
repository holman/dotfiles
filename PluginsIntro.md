## Tmux
read this https://gist.github.com/ryerh/14b7c24dfd623ef8edc7

重点解决无法鼠标选择复制的问题

 使用插件 - via tpm

 	1. 执行 git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm 
 	2. 执行 bash ~/.tmux/plugins/tpm/bin/install_plugins

配置解析:

设置默认终端模式为256color，前缀键，panel分割键，文本复制模式设置为vi，方向移动与vi模式一致hjkl分别为上下右左,使用鼠标或触摸板滑动窗口内容（之前窗口内容被锁死是非常愚蠢的）

```shell
# -- base setting -- #
set -g default-terminal "screen-256color"

# Use Ctrl+a as the prefix key
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# Split pane.
unbind '"'
bind | splitw -h
unbind '%'
bind - splitw -v

# Copy mode
# copy-mode to vi mode
setw -g mode-keys vi

# Map panel switch.
# Up
bind-key k select-pane -U
# Down
bind-key j select-pane -D
# left
bind-key h select-pane -L
# right
bind-key l select-pane -R

# roll screen with mouse
set-option -g mouse on

# -----------------------------------------------------------------------------
# 从上面的链接中copy下来的配置
# -----------------------------------------------------------------------------
set -g base-index         1     # 窗口编号从 1 开始计数
set -g display-panes-time 10000 # PREFIX-Q 显示编号的驻留时长，单位 ms
set -g mouse              on    # 开启鼠标
set -g pane-base-index    1     # 窗格编号从 1 开始计数
set -g renumber-windows   on    # 关掉某个窗口后，编号重排

setw -g allow-rename      off   # 禁止活动进程修改窗口名
setw -g automatic-rename  off   # 禁止自动命名新窗口
setw -g mode-keys         vi    # 进入复制模式的时候使用 vi 键位（默认是 EMACS）

# -----------------------------------------------------------------------------
# 使用插件 - via tpm
#   1. 执行 git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
#   2. 执行 bash ~/.tmux/plugins/tpm/bin/install_plugins
# -----------------------------------------------------------------------------

setenv -g TMUX_PLUGIN_MANAGER_PATH '~/.tmux/plugins'

# 推荐的插件（请去每个插件的仓库下读一读使用教程）
set -g @plugin 'seebi/tmux-colors-solarized'
set -g @plugin 'tmux-plugins/tmux-pain-control'
set -g @plugin 'tmux-plugins/tmux-prefix-highlight'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-yank'
set -g @plugin 'tmux-plugins/tpm'

# tmux-resurrect
set -g @resurrect-dir '~/.tmux/resurrect'

# tmux-prefix-highlight
set -g status-right '#{prefix_highlight} #H | %a %Y-%m-%d %H:%M'
set -g @prefix_highlight_show_copy_mode 'on'
set -g @prefix_highlight_copy_mode_attr 'fg=white,bg=blue'

# 初始化 TPM 插件管理器 (放在配置文件的最后)
run '~/.tmux/plugins/tpm/tpm'

# -----------------------------------------------------------------------------
# 结束
# -----------------------------------------------------------------------------

```

常用选项

```
d  退出 tmux（tmux 仍在后台运行）
t  窗口中央显示一个数字时钟
?  列出所有快捷键
:  命令提示符
```

启动新会话：

```
tmux [new -s 会话名 -n 窗口名]
```

恢复会话：

```
tmux at [-t 会话名]
```

列出所有会话：

```
tmux ls
```

关闭会话：

```
tmux kill-session -t 会话名
```

关闭所有会话：

```
tmux ls | grep : | cut -d. -f1 | awk '{print substr($1, 0, length($1)-1)}' | xargs kill
```

