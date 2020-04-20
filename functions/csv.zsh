function pretty_csv {
    column -s, -t < $1 | less -#2 -N -S
}