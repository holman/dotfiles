#!/usr/bin/env bash

EMAIL_FILE="$HOME/.email_addresses"


msg () {
  printf "\r  [ \033[0;33m$1\033[0m ] $2\n"
}


get_email() {
  email_type="$1"

  if [ -f "${EMAIL_FILE}" ]; then
    case "${email_type}" in
      personal)
        awk -F= '$1=="personal" {print $2}' "${EMAIL_FILE}"
        ;;
      corporate)
        awk -F= '$1=="corporate" {print $2}' "${EMAIL_FILE}"
        ;;
      *)
        msg "!!" "Invalid email type. Please choose 'personal' or 'corporate'."
        exit
        ;;
    esac
  else
    msg "💥" "Email file \033[0;31m${EMAIL_FILE}\033[0m not found."
    exit 
  fi
}

create_key() {
    if [ ! -f "$1" ]; then
        local email=$(get_email "$2")
        msg "🔑" "Creating a \033[0;33m$2\033[0m SSH key for you with the email \033[0;33m$email\033[0m"
        ssh-keygen -t ed25519 -f $1 -C $email  -N "" 1>/dev/null 2>&1
    else
        msg "🔑" "Your \033[0;33m$2\033[0m SSH key exists."
    fi
}

create_key "$HOME/.ssh/id_ed25519" "personal"
create_key "$HOME/.ssh/id_ed25519_mbh" "corporate"