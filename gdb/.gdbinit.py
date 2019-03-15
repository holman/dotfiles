import os,sys

my_dotfiles_gdb_dir = '/home/gnaddaf/src/dotfiles/gdb'  # os.getcwd() + '/..' * 4
print ('setting syspath to include directory {}'.format(my_dotfiles_gdb_dir))
sys.path = ['/usr/share/gcc-6/python', my_dotfiles_gdb_dir + '/printers/python'] + sys.path

import libstdcxx.v6.printers as printers
printers.register_libstdcxx_printers (gdb.current_objfile())

