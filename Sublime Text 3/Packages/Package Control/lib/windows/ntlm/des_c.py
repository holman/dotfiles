# This file is part of 'NTLM Authorization Proxy Server' http://sourceforge.net/projects/ntlmaps/
# Copyright 2001 Dmitry A. Rozmanov <dima@xenon.spb.ru>
#
# This library is free software: you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation, either
# version 3 of the License, or (at your option) any later version.
 
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
# 
# You should have received a copy of the GNU Lesser General Public
# License along with this library.  If not, see <http://www.gnu.org/licenses/> or <http://www.gnu.org/licenses/lgpl.txt>.

from U32 import U32

# --NON ASCII COMMENT ELIDED--
#typedef unsigned char des_cblock[8];
#define HDRSIZE 4

def c2l(c):
    "char[4] to unsigned long"
    l = U32(c[0])
    l = l | (U32(c[1]) << 8)
    l = l | (U32(c[2]) << 16)
    l = l | (U32(c[3]) << 24)
    return l

def c2ln(c,l1,l2,n):
    "char[n] to two unsigned long???"
    c = c + n
    l1, l2 = U32(0), U32(0)

    f = 0
    if n == 8:
        l2 = l2 | (U32(c[7]) << 24)
        f = 1
    if f or (n == 7):
        l2 = l2 | (U32(c[6]) << 16)
        f = 1
    if f or (n == 6):
        l2 = l2 | (U32(c[5]) << 8)
        f = 1
    if f or (n == 5):
        l2 = l2 | U32(c[4])
        f = 1
    if f or (n == 4):
        l1 = l1 | (U32(c[3]) << 24)
        f = 1
    if f or (n == 3):
        l1 = l1 | (U32(c[2]) << 16)
        f = 1
    if f or (n == 2):
        l1 = l1 | (U32(c[1]) << 8)
        f = 1
    if f or (n == 1):
        l1 = l1 | U32(c[0])
    return (l1, l2)

def l2c(l):
    "unsigned long to char[4]"
    c = []
    c.append(int(l & U32(0xFF)))
    c.append(int((l >> 8) & U32(0xFF)))
    c.append(int((l >> 16) & U32(0xFF)))
    c.append(int((l >> 24) & U32(0xFF)))
    return c

def n2l(c, l):
    "network to host long"
    l = U32(c[0] << 24)
    l = l | (U32(c[1]) << 16)
    l = l | (U32(c[2]) << 8)
    l = l | (U32(c[3]))
    return l

def l2n(l, c):
    "host to network long"
    c = []
    c.append(int((l >> 24) & U32(0xFF)))
    c.append(int((l >> 16) & U32(0xFF)))
    c.append(int((l >>  8) & U32(0xFF)))
    c.append(int((l      ) & U32(0xFF)))
    return c

def l2cn(l1, l2, c, n):
    ""
    for i in range(n): c.append(0x00)
    f = 0
    if f or (n == 8):
        c[7] = int((l2 >> 24) & U32(0xFF))
        f = 1
    if f or (n == 7):
        c[6] = int((l2 >> 16) & U32(0xFF))
        f = 1
    if f or (n == 6):
        c[5] = int((l2 >>  8) & U32(0xFF))
        f = 1
    if f or (n == 5):
        c[4] = int((l2      ) & U32(0xFF))
        f = 1
    if f or (n == 4):
        c[3] = int((l1 >> 24) & U32(0xFF))
        f = 1
    if f or (n == 3):
        c[2] = int((l1 >> 16) & U32(0xFF))
        f = 1
    if f or (n == 2):
        c[1] = int((l1 >>  8) & U32(0xFF))
        f = 1
    if f or (n == 1):
        c[0] = int((l1      ) & U32(0xFF))
        f = 1
    return c[:n]

# array of data
# static unsigned long des_SPtrans[8][64]={
# static unsigned long des_skb[8][64]={
from des_data import des_SPtrans, des_skb

def D_ENCRYPT(tup, u, t, s):
    L, R, S = tup
    #print 'LRS1', L, R, S, u, t, '-->',
    u = (R ^ s[S])
    t = R ^ s[S + 1]
    t = ((t >> 4) + (t << 28))
    L = L ^ (des_SPtrans[1][int((t    ) & U32(0x3f))] | \
        des_SPtrans[3][int((t >>  8) & U32(0x3f))] | \
        des_SPtrans[5][int((t >> 16) & U32(0x3f))] | \
        des_SPtrans[7][int((t >> 24) & U32(0x3f))] | \
        des_SPtrans[0][int((u      ) & U32(0x3f))] | \
        des_SPtrans[2][int((u >>  8) & U32(0x3f))] | \
        des_SPtrans[4][int((u >> 16) & U32(0x3f))] | \
        des_SPtrans[6][int((u >> 24) & U32(0x3f))])
    #print 'LRS:', L, R, S, u, t
    return ((L, R, S), u, t, s)


def PERM_OP (tup, n, m):
    "tup - (a, b, t)"
    a, b, t = tup
    t = ((a >> n) ^ b) & m
    b = b ^ t
    a = a ^ (t << n)
    return (a, b, t)

def HPERM_OP (tup, n, m):
    "tup - (a, t)"
    a, t = tup
    t = ((a << (16 - n)) ^ a) & m
    a = a ^ t ^ (t >> (16 - n))
    return (a, t)

shifts2 = [0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0]

class DES:
    KeySched = None # des_key_schedule

    def __init__(self, key_str):
        # key - UChar[8]
        key = []
        for i in key_str: key.append(ord(i))
        #print 'key:', key
        self.KeySched = des_set_key(key)
        #print 'schedule:', self.KeySched, len(self.KeySched)

    def decrypt(self, str):
        # block - UChar[]
        block = []
        for i in str: block.append(ord(i))
        #print block
        block = des_ecb_encrypt(block, self.KeySched, 0)
        res = ''
        for i in block: res = res + (chr(i))
        return res

    def encrypt(self, str):
        # block - UChar[]
        block = []
        for i in str: block.append(ord(i))
        block = des_ecb_encrypt(block, self.KeySched, 1)
        res = ''
        for i in block: res = res + (chr(i))
        return res






#------------------------
def des_encript(input, ks, encrypt):
    # input - U32[]
    # output - U32[]
    # ks - des_key_shedule - U32[2][16]
    # encrypt - int
    # l, r, t, u - U32
    # i - int
    # s - U32[]

    l = input[0]
    r = input[1]
    t = U32(0)
    u = U32(0)

    r, l, t = PERM_OP((r, l, t),  4, U32(0x0f0f0f0fL))
    l, r, t = PERM_OP((l, r, t), 16, U32(0x0000ffffL))
    r, l, t = PERM_OP((r, l, t),  2, U32(0x33333333L))
    l, r, t = PERM_OP((l, r, t),  8, U32(0x00ff00ffL))
    r, l, t = PERM_OP((r, l, t),  1, U32(0x55555555L))

    t = (r << 1)|(r >> 31)
    r = (l << 1)|(l >> 31)
    l = t

    s = ks # ???????????????
    #print l, r
    if(encrypt):
        for i in range(0, 32, 4):
            rtup, u, t, s = D_ENCRYPT((l, r, i + 0), u, t, s)
            l = rtup[0]
            r = rtup[1]
            rtup, u, t, s = D_ENCRYPT((r, l, i + 2), u, t, s)
            r = rtup[0]
            l = rtup[1]
    else:
        for i in range(30, 0, -4):
            rtup, u, t, s = D_ENCRYPT((l, r, i - 0), u, t, s)
            l = rtup[0]
            r = rtup[1]
            rtup, u, t, s = D_ENCRYPT((r, l, i - 2), u, t, s)
            r = rtup[0]
            l = rtup[1]
    #print l, r
    l = (l >> 1)|(l << 31)
    r = (r >> 1)|(r << 31)

    r, l, t = PERM_OP((r, l, t),  1, U32(0x55555555L))
    l, r, t = PERM_OP((l, r, t),  8, U32(0x00ff00ffL))
    r, l, t = PERM_OP((r, l, t),  2, U32(0x33333333L))
    l, r, t = PERM_OP((l, r, t), 16, U32(0x0000ffffL))
    r, l, t = PERM_OP((r, l, t),  4, U32(0x0f0f0f0fL))

    output = [l]
    output.append(r)
    l, r, t, u = U32(0), U32(0), U32(0), U32(0)
    return output

def des_ecb_encrypt(input, ks, encrypt):
    # input - des_cblock - UChar[8]
    # output - des_cblock - UChar[8]
    # ks - des_key_shedule - U32[2][16]
    # encrypt - int

    #print input
    l0 = c2l(input[0:4])
    l1 = c2l(input[4:8])
    ll = [l0]
    ll.append(l1)
    #print ll
    ll = des_encript(ll, ks, encrypt)
    #print ll
    l0 = ll[0]
    l1 = ll[1]
    output = l2c(l0)
    output = output + l2c(l1)
    #print output
    l0, l1, ll[0], ll[1] = U32(0), U32(0), U32(0), U32(0)
    return output

def des_set_key(key):
    # key - des_cblock - UChar[8]
    # schedule - des_key_schedule

    # register unsigned long c,d,t,s;
    # register unsigned char *in;
    # register unsigned long *k;
    # register int i;

    #k = schedule
    # in = key

    k = []
    c = c2l(key[0:4])
    d = c2l(key[4:8])
    t = U32(0)

    d, c, t = PERM_OP((d, c, t), 4, U32(0x0f0f0f0fL))
    c, t = HPERM_OP((c, t), -2, U32(0xcccc0000L))
    d, t = HPERM_OP((d, t), -2, U32(0xcccc0000L))
    d, c, t = PERM_OP((d, c, t), 1, U32(0x55555555L))
    c, d, t = PERM_OP((c, d, t), 8, U32(0x00ff00ffL))
    d, c, t = PERM_OP((d, c, t), 1, U32(0x55555555L))

    d = (((d & U32(0x000000ffL)) << 16)|(d & U32(0x0000ff00L))|((d & U32(0x00ff0000L)) >> 16)|((c & U32(0xf0000000L)) >> 4))
    c  = c & U32(0x0fffffffL)

    for i in range(16):
        if (shifts2[i]):
            c = ((c >> 2)|(c << 26))
            d = ((d >> 2)|(d << 26))
        else:
            c = ((c >> 1)|(c << 27))
            d = ((d >> 1)|(d << 27))
        c = c & U32(0x0fffffffL)
        d = d & U32(0x0fffffffL)

        s=  des_skb[0][int((c    ) & U32(0x3f))]|\
            des_skb[1][int(((c>> 6) & U32(0x03))|((c>> 7) & U32(0x3c)))]|\
            des_skb[2][int(((c>>13) & U32(0x0f))|((c>>14) & U32(0x30)))]|\
            des_skb[3][int(((c>>20) & U32(0x01))|((c>>21) & U32(0x06)) | ((c>>22) & U32(0x38)))]

        t=  des_skb[4][int((d    ) & U32(0x3f)                )]|\
            des_skb[5][int(((d>> 7) & U32(0x03))|((d>> 8) & U32(0x3c)))]|\
            des_skb[6][int((d>>15) & U32(0x3f)                )]|\
            des_skb[7][int(((d>>21) & U32(0x0f))|((d>>22) & U32(0x30)))]
        #print s, t

        k.append(((t << 16)|(s & U32(0x0000ffffL))) & U32(0xffffffffL))
        s = ((s >> 16)|(t & U32(0xffff0000L)))
        s = (s << 4)|(s >> 28)
        k.append(s & U32(0xffffffffL))

    schedule = k

    return schedule
