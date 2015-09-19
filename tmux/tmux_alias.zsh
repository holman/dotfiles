# Add an alias to open a session if exists or create it

function to() {
  ta $1 || ts $1
}
