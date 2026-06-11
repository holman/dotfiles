# grc overides for ls
#   Made possible through contributions from generous benefactors like
#   `brew install coreutils`
#
# Only used as a fallback: when `eza` is installed it owns ls/ll/la
# (see eza/aliases.zsh). This guard makes load order between the two irrelevant.
if ! command -v eza &>/dev/null && $(gls &>/dev/null)
then
  alias ls="gls -F --color"
  alias l="gls -lAh --color"
  alias ll="gls -l --color"
  alias la='gls -A --color'
fi
