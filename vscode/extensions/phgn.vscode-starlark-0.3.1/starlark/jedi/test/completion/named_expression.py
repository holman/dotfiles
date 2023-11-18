# python >= 3.8
b = (a:=1, a)

#? int()
b[0]
#?
b[1]

# Should not fail
b = ('':=1,)

#? int()
b[0]
