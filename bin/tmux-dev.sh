#!/bin/bash

function init_web() {
	local $session=$1
	local position=$2
	tmux send-keys -t $session:$position 'vagrant ssh web' Enter 'cd /vagrant/src' Enter
	if $new && [ $position = '2' ]; then
		tmux send-keys -t $1:2 'cd /vagrant/ && make clean install;' . ~/venvs/$1/bin/activate; cd src Enter
	fi
}

function init_db() {
	local $session=$1
	local position=$2
	tmux send-keys -t $session:$position 'vagrant ssh db' Enter 'sudo -u postgres psql -d' $1 Enter
}

function init_broker() {
	local $session=$1
	local position=$2
	tmux send-keys -t $session:$position 'vagrant ssh broker' Enter
}

function init_worker() {
	local session=$1
	local position=$2
	local new=$3

	tmux send-keys -t $session:$position 'vagrant ssh worker' Enter 'cd /vagrant/src' Enter
	if $new ; then
		tmux send-keys -t $1:$position 'cd /vagrant/ && make clean install;' . ~/venvs/$1/bin/activate; 'cd src' Enter
	fi
	tmux send-keys 'python manage.py '
}

function init_es() {
	local session=$1
	local position=$2

	tmux send-keys -t $session:$position 'vagrant ssh els' Enter
}


session=$1
directory=$HOME/Development/projects/$session

web_test=1
web=2
db_pos=3
broker_pos=4
worker_pos=5

tmux start-server
tmux new-session -c $directory -n 'bash' -s $session -A -d
tmux send-keys -t $session:0 'vagrant up' Enter
tmux new-window -t $session -n 'web-test' -c $directory
tmux new-window -t $session -n 'web' -c $directory
tmux new-window -t $session -n 'db' -c $directory
tmux new-window -t $session -n 'broker' -c $directory
tmux new-window -t $session -n 'worker' -c $directory

init_web $session $web_test
init_web $session $web
init_db $session $db_pos
init_broker $session $broker_pos
init_worker $session $worker_pos $new

if [ $session == 'vanessa' ]; then
	tmux new-window -t $session 'es' -c $directory
	init_es $session 6
fi

tmux attach-session -t $session:0
