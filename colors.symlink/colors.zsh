#
# Colors
#

BASE16_CONFIG=~/.vim/.base16

# Takes a hex color in the form of "RRGGBB" and outputs its luma (0-255, where
# 0 is black and 255 is white).
#
# Based on: https://github.com/lencioni/dotfiles/blob/b1632a04/.shells/colors
luma() {
  local COLOR_HEX=$1

  if [ -z "$COLOR_HEX" ]; then
    echo "Missing argument hex color (RRGGBB)"
    return 1
  fi

  # Extract hex channels from background color (RRGGBB).
  local COLOR_HEX_RED=$(echo "$COLOR_HEX" | cut -c 1-2)
  local COLOR_HEX_GREEN=$(echo "$COLOR_HEX" | cut -c 3-4)
  local COLOR_HEX_BLUE=$(echo "$COLOR_HEX" | cut -c 5-6)

  # Convert hex colors to decimal.
  local COLOR_DEC_RED=$((16#$COLOR_HEX_RED))
  local COLOR_DEC_GREEN=$((16#$COLOR_HEX_GREEN))
  local COLOR_DEC_BLUE=$((16#$COLOR_HEX_BLUE))

  # Calculate perceived brightness of background per ITU-R BT.709
  # https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients
  # http://stackoverflow.com/a/12043228/18986
  local COLOR_LUMA_RED=$((0.2126 * $COLOR_DEC_RED))
  local COLOR_LUMA_GREEN=$((0.7152 * $COLOR_DEC_GREEN))
  local COLOR_LUMA_BLUE=$((0.0722 * $COLOR_DEC_BLUE))

  local COLOR_LUMA=$(($COLOR_LUMA_RED + $COLOR_LUMA_GREEN + $COLOR_LUMA_BLUE))

  echo "$COLOR_LUMA"
}

color() {
  local SCHEME="$1"
  local BASE16_DIR=~/.colors/base16-shell/scripts

  if [ $# -eq 0 ]; then
    if [ -s "$BASE16_CONFIG" ]; then
      cat ~/.vim/.base16
      return
    else
      SCHEME=help
    fi
  fi

  case "$SCHEME" in
  help)
    echo 'color [tomorrow-night|ocean|grayscale-light|...]'
    echo
    echo 'Available schemes:'
    color ls
    ;;
  ls)
    find "$BASE16_DIR" -name 'base16-*.sh' | \
      sed -E 's|.+/base16-||' | \
      sed -E 's/\.sh//' | \
      column
      ;;
  *)
    FILE="$BASE16_DIR/base16-$SCHEME.sh"
    if [[ -e "$FILE" ]]; then
      local BG=$(grep color_background= "$FILE" | cut -d \" -f2 | sed -e 's#/##g')
      local LUMA=$(luma "$BG")
      local LIGHT=$((LUMA > 127.5))
      local BACKGROUND=dark
      if [ "$LIGHT" -eq 1 ]; then
        BACKGROUND=light
      fi

      echo "$SCHEME" >! "$BASE16_CONFIG"
      echo "$BACKGROUND" >> "$BASE16_CONFIG"
      . "$FILE"

      if [ -n "$TMUX" ]; then
        local CC=$(grep color18= "$FILE" | cut -d \" -f2 | sed -e 's#/##g')
        if [ -n "$BG" -a -n "$CC" ]; then
          command tmux set -a window-active-style "bg=#$BG"
          command tmux set -a window-style "bg=#$CC"
          command tmux set -g pane-active-border-style "bg=#$CC"
          command tmux set -g pane-border-style "bg=#$CC"
        fi
      fi
    else
      echo "Scheme '$SCHEME' not found in $BASE16_DIR"
      return 1
    fi
    ;;
  esac

}

function () {
  if [[ -s "$BASE16_CONFIG" ]]; then
    local SCHEME=$(head -1 "$BASE16_CONFIG")
    local BACKGROUND=$(sed -n -e '2 p' "$BASE16_CONFIG")
    if [ "$BACKGROUND" != 'dark' -a "$BACKGROUND" != 'light' ]; then
      echo "warning: unknown background type in $BASE16_CONFIG"
    fi
    color "$SCHEME"
  else
    # Default.
    color ocean
  fi
}
