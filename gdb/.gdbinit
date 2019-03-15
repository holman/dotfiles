source .gdbinit.cocoabeans
source .gdbinit.py

set substitute-path /data/jenkins/workspace/MASTER-Debian_Appliance-Make-Cpp/ /home/gnaddaf/src/pvc-appliance/

set print pretty on
set print object on
set print static-members on
set print vtbl on
set print demangle on
set demangle-style gnu-v3
set print sevenbit-strings off

set auto-load safe-path /

