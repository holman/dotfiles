"""
Fallback to callee definition when definition not found.
- https://github.com/davidhalter/jedi/issues/131
- https://github.com/davidhalter/jedi/pull/149
"""

"""Parenthesis closed at next line."""

# Ignore these definitions for a little while, not sure if we really want them.
# python <= 2.5

#? isinstance
isinstance(
)

#? isinstance
isinstance( 
)

#? isinstance
isinstance(None,
)

#? isinstance
isinstance(None, 
)

"""Parenthesis closed at same line."""

# Note: len('isinstance(') == 11
#? 11 isinstance
isinstance()

# Note: len('isinstance(None,') == 16
##? 16 isinstance
isinstance(None,)

# Note: len('isinstance(None,') == 16
##? 16 isinstance
isinstance(None, )

# Note: len('isinstance(None, ') == 17
##? 17 isinstance
isinstance(None, )

# Note: len('isinstance( ') == 12
##? 12 isinstance
isinstance( )

"""Unclosed parenthesis."""

#? isinstance
isinstance(

def x(): pass  # acts like EOF

##? isinstance
isinstance( 

def x(): pass  # acts like EOF

#? isinstance
isinstance(None,

def x(): pass  # acts like EOF

##? isinstance
isinstance(None, 
