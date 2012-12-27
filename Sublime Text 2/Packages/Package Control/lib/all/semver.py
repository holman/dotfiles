# -*- coding: utf-8 -*-
# This code is copyright Konstantine Rybnikov <k-bx@k-bx.com>, and is
# available at https://github.com/k-bx/python-semver and is licensed under the
# BSD License

import re

_REGEX = re.compile('^(?P<major>[0-9]+)'
                    '\.(?P<minor>[0-9]+)'
                    '\.(?P<patch>[0-9]+)'
                    '(\-(?P<prerelease>[0-9A-Za-z]+(\.[0-9A-Za-z]+)*))?'
                    '(\+(?P<build>[0-9A-Za-z]+(\.[0-9A-Za-z]+)*))?$')

if 'cmp' not in __builtins__:
    cmp = lambda a,b: (a > b) - (a < b)

def parse(version):
    """
    Parse version to major, minor, patch, pre-release, build parts.
    """
    match = _REGEX.match(version)
    if match is None:
        raise ValueError('%s is not valid SemVer string' % version)

    verinfo = match.groupdict()

    verinfo['major'] = int(verinfo['major'])
    verinfo['minor'] = int(verinfo['minor'])
    verinfo['patch'] = int(verinfo['patch'])

    return verinfo


def compare(ver1, ver2):
    def nat_cmp(a, b):
        a, b = a or '', b or ''
        convert = lambda text: text.isdigit() and int(text) or text.lower()
        alphanum_key = lambda key: [convert(c) for c in re.split('([0-9]+)', key)]
        return cmp(alphanum_key(a), alphanum_key(b))

    def compare_by_keys(d1, d2):
        for key in ['major', 'minor', 'patch']:
            v = cmp(d1.get(key), d2.get(key))
            if v:
                return v
        rc1, rc2 = d1.get('prerelease'), d2.get('prerelease')
        build1, build2 = d1.get('build'), d2.get('build')
        rccmp = nat_cmp(rc1, rc2)
        buildcmp = nat_cmp(build1, build2)
        if not (rc1 or rc2):
            return buildcmp
        elif not rc1:
            return 1
        elif not rc2:
            return -1
        return rccmp or buildcmp or 0

    v1, v2 = parse(ver1), parse(ver2)

    return compare_by_keys(v1, v2)


def match(version, match_expr):
    prefix = match_expr[:2]
    if prefix in ('>=', '<=', '=='):
        match_version = match_expr[2:]
    elif prefix and prefix[0] in ('>', '<', '='):
        prefix = prefix[0]
        match_version = match_expr[1:]
    else:
        raise ValueError("match_expr parameter should be in format <op><ver>, "
                         "where <op> is one of ['<', '>', '==', '<=', '>=']. "
                         "You provided: %r" % match_expr)

    possibilities_dict = {
        '>': (1,),
        '<': (-1,),
        '==': (0,),
        '>=': (0, 1),
        '<=': (-1, 0)
    }

    possibilities = possibilities_dict[prefix]
    cmp_res = compare(version, match_version)

    return cmp_res in possibilities