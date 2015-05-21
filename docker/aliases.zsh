alias dmongo='docker run -it --rm --link mongodb:mongodb dockerfile/mongodb bash -c "mongo --host mongodb"'
alias dcmongodb='docker run -d -p 27017:27017 -p 28017:28017 --name mongodb dockerfile/mongodb mongod --rest --httpinterface'
alias dsmongo='docker stop mongodb'
alias dstmongo='docker start mongodb'
