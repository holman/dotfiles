# GRC colorizes nifty unix tools all over the place
if $(gls &>/dev/null)
then
  source `brew --prefix`/etc/grc.bashrc
fi