import contextlib
from sublime import Region


def append(view, text):
    """Appends text to view."""
    with in_one_edit(view) as edit:
        view.insert(edit, view.size(), text)


@contextlib.contextmanager
def in_one_edit(view):
    """Context manager to group edits in a view.

        Example:
            ...
            with in_one_edit(view):
                ...
            ...
    """
    try:
        edit = view.begin_edit()
        yield edit
    finally:
        view.end_edit(edit)


def has_sels(view):
    """Returns ``True`` if ``view`` has one selection or more.``
    """
    return len(view.sel()) > 0


def has_file_ext(view, ext):
    """Returns ``True`` if view has file extension ``ext``.
    ``ext`` may be specified with or without leading ``.``.
    """
    if not view.file_name() or not ext.strip().replace('.', ''):
        return False

    if not ext.startswith('.'):
        ext = '.' + ext

    return view.file_name().endswith(ext)


def rowcount(view):
    """Returns the number of rows in ``view``.
    """
    return view.rowcol(view.size())[0] + 1


def rowwidth(view, row):
    """Returns the number of characters of ``row`` in ``view``.
    """
    return view.rowcol(view.line(view.text_point(row, 0)).end())[1]


def relative_point(view, x=0, y=0, p=None):
    """Returns a point (int) to the given coordinates.

    Supports relative (negative) parameters and checks if they are in the
    bounds (other than ``View.text_point()``).

    If p (indexable -> ``p[0]``, ``len(p) == 2``; preferrably a tuple) is
    specified, x and y parameters are overridden.
    """
    if p is not None:
        if len(p) != 2:
            raise TypeError("Coordinates have 2 dimensions, not %d" % len(p))
        (x, y) = p
    row, col = x, y

    # shortcut
    if x == -1 and y == -1:
        return view.size()

    # calc absolute coords and check if coords are in the bounds
    rowc = rowcount(view)
    if x < 0:
        row = max(rowc + x, 0)
    else:
        row = min(row, rowc)

    roww = rowwidth(view, row)
    if y < 0:
        col = max(roww + y, 0)
    else:
        col = min(col, roww)

    return view.text_point(row, col)


def coorded_region(view, reg1=None, reg2=None):
    """Returns a region of two coordinate pairs parsed by ``relative_point(view, p=reg1)``.

    The pairs are supporsed to be indexable and have a length of 2.
    Tuples are preferred.

    Defaults to the whole buffer (``reg1=(0, 0), reg2=(-1, -1)``).
    """
    reg1 = reg1 or (0, 0)
    reg2 = reg2 or (-1, -1)

    p1 = relative_point(view, p=reg1)
    p2 = relative_point(view, p=reg2)
    return Region(p1, p2)


def coorded_substr(view, reg1=None, reg2=None):
    """Returns the string of two coordinate pairs parsed by ``relative_point(view, p=reg1)``.

    The pairs are supporsed to be indexable and have a length of 2.
    Tuples are preferred.

    Defaults to the whole buffer.
    """
    return view.substr(coorded_region(view, reg1, reg2))


def get_text(view):
    """Returns the whole string of a buffer.

    Alias for ``coorded_substr(view)``.
    """
    return coorded_substr(view)
