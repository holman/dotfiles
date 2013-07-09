"""Manage general information about buzhug bases :
field definitions with types and default values"""

import os
import urllib

def set_info(base,fields):
    base.defaults = {}
    for field in fields:
        validate_field(base,field)

def validate_field(base,field_def):
    """Validate field definition"""
    name,typ = field_def[:2]
    if name in ['__id__','__version__']:
        raise ValueError,'Field name "%s" is reserved' %name
    elif name.startswith('_'):
        raise ValueError,"Error for %s : names can't begin with _" \
            % name
    if typ not in base.types.values():
        if isinstance(typ,base.__class__): # external link
            base._register_base(typ)
        else:
            raise TypeError,"type %s not allowed" %typ    
    if len(field_def)>2:
        # if a default value is provided, check if it is valid
        default = field_def[2]
        if isinstance(typ,base.__class__):
            if not hasattr(default.__class__,"db") or \
                not default.__class__.db is typ:
                raise ValueError,'Incorrect default value for field "%s"' \
                    " : expected %s, got %s (class %s)" %(name,typ,
                        default,default.__class__)
        elif not isinstance(default,typ):
            raise ValueError,'Incorrect default value for field "%s"' \
                " : expected %s, got %s (class %s)" %(name,typ,
                    default,default.__class__)
        base.defaults[name] = default
    else:
        base.defaults[name] = None

def save_info(base):
    """Save field information in files __info___ and __defaults__"""
    _info = open(base.info_name,'wb')
    fields = []
    for k in base.field_names:
        if isinstance(base.fields[k],base.__class__):
            fields.append((k,'<base>'+urllib.quote(base.fields[k].name)))
        else:
            fields.append((k,base.fields[k].__name__))
    _info.write(' '.join(['%s:%s' %(k,v) for (k,v) in fields]))
    _info.close()
    out = open(os.path.join(base.name,"__defaults__"),"wb")
    for field_name,default_value in base.defaults.iteritems():
        if field_name in ["__id__","__version__"]:
            continue
        value = base._file[field_name].to_block(default_value)
        out.write("%s %s" %(field_name,value))
    out.close()

def read_defaults(base):
    import buzhug_files
    defaults = dict([(f,None) for f in base.field_names[2:]])
    if os.path.exists(os.path.join(base.name,"__defaults__")):
        defs = open(os.path.join(base.name,"__defaults__"),"rb").read()
        ix = 0
        f_name = ""
        while ix<len(defs):
            if defs[ix]==" ":
                ix += 1
                if issubclass(base._file[f_name].__class__,
                    buzhug_files.FixedLengthFile):
                    length = base._file[f_name].block_len
                    block = defs[ix:ix+length]
                    ix += length
                else:
                    block = ""
                    while not defs[ix] == "\n":
                        block += defs[ix]
                        ix += 1
                    block += "\n"
                    ix += 1
                defaults[f_name] = base._file[f_name].from_block(block)
                f_name = ""
            else:
                f_name += defs[ix]
                ix += 1
    return defaults