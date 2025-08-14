# Python and uv development aliases
alias py='python'
alias py3='python3'
alias pip='uv pip'
alias pip3='uv pip'

# uv shortcuts
alias uv-init='uv init'
alias uv-add='uv add'
alias uv-remove='uv remove'
alias uv-run='uv run'
alias uv-sync='uv sync'
alias uv-lock='uv lock'
alias uv-install='uv pip install'
alias uv-list='uv pip list'
alias uv-tree='uv tree'

# Python project shortcuts
alias python-serve='python -m http.server'
alias python-json='python -m json.tool'
alias python-profile='python -m cProfile'
alias python-pdb='python -m pdb'

# Virtual environment helpers
alias venv-create='uv venv'
alias venv-activate='source .venv/bin/activate'
alias venv-deactivate='deactivate'

# Common Python tools
alias black='uv run black'
alias isort='uv run isort'
alias flake8='uv run flake8'
alias mypy='uv run mypy'
alias pytest='uv run pytest'
alias ruff='uv run ruff'