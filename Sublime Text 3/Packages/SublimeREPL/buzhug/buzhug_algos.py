"""Implementation of fast search algorithms
Used in select when one of the search fields has a fixed-length size

Instead of taking all the blocks in field files one after the other, a big
number of blocks are read and the search is made on the buffer
"""

from datetime import date, datetime
import itertools

# compatibility with Python 2.3
try:
    set([1])
except NameError:
    from sets import Set as set

def rev(s):
    """ function used to compare strings in decreasing order"""
    return ''.join([chr(255-ord(c)) for c in s])

def make_search_func(db,field,value):
    """Return the search function on a field
    If value is a pair of values (v1,v2), all blocks between v1 and v2
    will be returned ; if value is a single value then all blocks with
    this value will be returned
    """
    bl = db._file[field].block_len  # block length
    if isinstance(value,(list,tuple)):
        value = list(value)
        if not len(value)==2:
            raise ValueError,"If argument is a list, only 2 values \
                should be passed (found %s)" %len(value)
        if not db.fields[field] in [int,float,date,datetime]:
            raise TypeError,"Search between values is only allowed for " \
                "int, float, date and datetime (found %s)" %db.fields[field]
        db._validate(field,value[0])
        db._validate(field,value[1])
        value.sort()
        # convert values in blocks (strings representation in field files)
        s1,s2 = [ db.f_encode[db.fields[field]](v) for v in value ]
        # search the common leading characters in s1 and s2
        common = ''
        for i in range(len(s1)):
            if s1[i] == s2[i]:
                common += s1[i]
            else:
                break
        lc = len(common)
        Min = s1[lc:] # part of s1 not common with s2
        Max = s2[lc:] # part of s2 not common with s1

        def _search(buf):
            """Function searching blocks in the buffer such that
            s1 <= block <= s2
            Return a dictionary mapping rank of the block to the block
            
            The algorithm searches occurences of 'common', then checks
            that the rest of the block is between Min and Max
            """
            ranks = {}
            pos = 0
            while True:
                # search occurences of the common part between s1 and s2
                pos = buf.find(common,pos)
                if pos == -1:
                    break
                if pos % bl == 0:
                    # pos is a block start
                    block = buf[pos:pos+bl]
                    # rest of the block
                    rest = buf[pos+lc:pos+bl]
                    # compare rest of block to Min and Max
                    if Min <= rest <= Max:
                        ranks[pos/bl] = block
                pos += 1
            return ranks

    else:
        v = db.f_encode[db.fields[field]](value)

        def _search(buf):
            """Function searching blocks in the buffer such that
            block == v
            Return a dictionary mapping rank of the block to the block
            
            The algorithm searches occurences of the block v in the 
            buffer
            """
            ranks = {}
            pos = 0
            while True:
                pos = buf.find(v,pos)
                if pos>-1:
                    if pos % bl == 0:
                        # pos is a block start
                        ranks[pos/bl] = buf[pos:pos+bl]
                    pos += 1
                else:
                    break
            return ranks

    return _search

def fast_select(db,names,**args):
    """Handles requests like select(['name'],age=23,name='pierre') when
    one of the arg keys is fixed length type ; uses a fast search algo
    instead of browsing all the records
    
    The search functions are defined for all fixed-length arguments and
    used to select a subset of record rows in field files
    """
    # fixed and variable length fields
    f_args = [ (k,v) for k,v in args.iteritems() 
        if hasattr(db._file[k],'block_len') ]
    v_args = [ (k,v) for (k,v) in args.iteritems() 
        if not hasattr(db._file[k],'block_len') ]
    arg_names = [ k for k,v in f_args + v_args ]
    no_args = [ n for n in names if not n in arg_names ]
    names = arg_names + no_args

    [ db._file[k].seek(0) for k in names + args.keys() ]
    max_len = max([ db._file[k[0]].block_len for k in f_args ])
    num_blocks = db.BLOCKSIZE / max_len
    funcs = dict([(k,make_search_func(db,k,v)) 
                    for (k,v) in f_args])
    fl_ranks = [] # absolute ranks in fixed length files
    bl_offset = 0 # offset of current chunck
    res = {}
    while True:
        buf = {}
        ranks = {}
        # read a chunk of num_blocks blocks in each fixed-length file
        for i,(k,v) in enumerate(f_args):
            # rank[field] stores the rank of found values in
            # the buffer, between 0 and num_blocks-1
            bl = db._file[k].block_len
            buf[k] = db._file[k].read(num_blocks*bl)
            ranks[k] = funcs[k](buf[k])
        # test end of files
        if not buf[f_args[0][0]]:
            break
        # valid records are those with the same rank in all files
        rank_set=set(ranks[f_args[0][0]].keys())
        if len(f_args)>1:
            for (k,v) in f_args[1:]:
                rank_set = rank_set.intersection(set(ranks[k].keys()))
        for c in rank_set:
            res[bl_offset+c] = [ ranks[k][c] for k,v in f_args ]
        bl_offset += num_blocks

    fl_ranks = res.keys()
    fl_ranks.sort()

    # The field files for the other arguments are browsed ; if their
    # row is in the subset, test if the value for variable length arguments
    # is equal to the keyword value
    vl_files = [ db._file[k] for k,v in v_args ]
    nbvl = len(vl_files)
    vl_values = tuple([ db._file[k].to_block(v) for (k,v) in v_args ])
    no_args_files = [ db._file[k] for k in no_args ]
    other_files = vl_files + no_args_files
    for f in other_files:
        f.seek(0)

    for i,lines in enumerate(itertools.izip(*other_files)):
        try:
            if i == fl_ranks[0]:
                fl_ranks.pop(0)
                if lines[:nbvl] == vl_values:
                    res[i]+=list(lines)
                else:
                    del res[i]
        except IndexError:
            break
    return res,names
