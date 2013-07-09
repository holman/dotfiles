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

import struct
import base64
import string
import des
import hashlib
import hmac
import random
from socket import gethostname

NTLM_NegotiateUnicode                =  0x00000001
NTLM_NegotiateOEM                    =  0x00000002
NTLM_RequestTarget                   =  0x00000004
NTLM_Unknown9                        =  0x00000008
NTLM_NegotiateSign                   =  0x00000010
NTLM_NegotiateSeal                   =  0x00000020
NTLM_NegotiateDatagram               =  0x00000040
NTLM_NegotiateLanManagerKey          =  0x00000080
NTLM_Unknown8                        =  0x00000100
NTLM_NegotiateNTLM                   =  0x00000200
NTLM_NegotiateNTOnly                 =  0x00000400
NTLM_Anonymous                       =  0x00000800
NTLM_NegotiateOemDomainSupplied      =  0x00001000
NTLM_NegotiateOemWorkstationSupplied =  0x00002000
NTLM_Unknown6                        =  0x00004000
NTLM_NegotiateAlwaysSign             =  0x00008000
NTLM_TargetTypeDomain                =  0x00010000
NTLM_TargetTypeServer                =  0x00020000
NTLM_TargetTypeShare                 =  0x00040000
NTLM_NegotiateExtendedSecurity       =  0x00080000
NTLM_NegotiateIdentify               =  0x00100000
NTLM_Unknown5                        =  0x00200000
NTLM_RequestNonNTSessionKey          =  0x00400000
NTLM_NegotiateTargetInfo             =  0x00800000
NTLM_Unknown4                        =  0x01000000
NTLM_NegotiateVersion                =  0x02000000
NTLM_Unknown3                        =  0x04000000
NTLM_Unknown2                        =  0x08000000
NTLM_Unknown1                        =  0x10000000
NTLM_Negotiate128                    =  0x20000000
NTLM_NegotiateKeyExchange            =  0x40000000
NTLM_Negotiate56                     =  0x80000000

# we send these flags with our type 1 message
NTLM_TYPE1_FLAGS = (NTLM_NegotiateUnicode | \
                    NTLM_NegotiateOEM | \
                    NTLM_RequestTarget | \
                    NTLM_NegotiateNTLM | \
                    NTLM_NegotiateOemDomainSupplied | \
                    NTLM_NegotiateOemWorkstationSupplied | \
                    NTLM_NegotiateAlwaysSign | \
                    NTLM_NegotiateExtendedSecurity | \
                    NTLM_NegotiateVersion | \
                    NTLM_Negotiate128 | \
                    NTLM_Negotiate56 )
NTLM_TYPE2_FLAGS = (NTLM_NegotiateUnicode | \
                    NTLM_RequestTarget | \
                    NTLM_NegotiateNTLM | \
                    NTLM_NegotiateAlwaysSign | \
                    NTLM_NegotiateExtendedSecurity | \
                    NTLM_NegotiateTargetInfo | \
                    NTLM_NegotiateVersion | \
                    NTLM_Negotiate128 | \
                    NTLM_Negotiate56)

NTLM_MsvAvEOL             = 0 # Indicates that this is the last AV_PAIR in the list. AvLen MUST be 0. This type of information MUST be present in the AV pair list.
NTLM_MsvAvNbComputerName  = 1 # The server's NetBIOS computer name. The name MUST be in Unicode, and is not null-terminated. This type of information MUST be present in the AV_pair list.
NTLM_MsvAvNbDomainName    = 2 # The server's NetBIOS domain name. The name MUST be in Unicode, and is not null-terminated. This type of information MUST be present in the AV_pair list.
NTLM_MsvAvDnsComputerName = 3 # The server's Active Directory DNS computer name. The name MUST be in Unicode, and is not null-terminated.
NTLM_MsvAvDnsDomainName   = 4 # The server's Active Directory DNS domain name. The name MUST be in Unicode, and is not null-terminated.
NTLM_MsvAvDnsTreeName     = 5 # The server's Active Directory (AD) DNS forest tree name. The name MUST be in Unicode, and is not null-terminated.
NTLM_MsvAvFlags           = 6 # A field containing a 32-bit value indicating server or client configuration. 0x00000001: indicates to the client that the account authentication is constrained. 0x00000002: indicates that the client is providing message integrity in the MIC field (section 2.2.1.3) in the AUTHENTICATE_MESSAGE.
NTLM_MsvAvTimestamp       = 7 # A FILETIME structure ([MS-DTYP] section 2.3.1) in little-endian byte order that contains the server local time.<12>
NTLM_MsAvRestrictions     = 8 #A Restriction_Encoding structure (section 2.2.2.2). The Value field contains a structure representing the integrity level of the security principal, as well as a MachineID created at computer startup to identify the calling machine. <13>


"""
utility functions for Microsoft NTLM authentication

References:
[MS-NLMP]: NT LAN Manager (NTLM) Authentication Protocol Specification
http://download.microsoft.com/download/a/e/6/ae6e4142-aa58-45c6-8dcf-a657e5900cd3/%5BMS-NLMP%5D.pdf

[MS-NTHT]: NTLM Over HTTP Protocol Specification
http://download.microsoft.com/download/a/e/6/ae6e4142-aa58-45c6-8dcf-a657e5900cd3/%5BMS-NTHT%5D.pdf

Cntlm Authentication Proxy
http://cntlm.awk.cz/

NTLM Authorization Proxy Server
http://sourceforge.net/projects/ntlmaps/

Optimized Attack for NTLM2 Session Response
http://www.blackhat.com/presentations/bh-asia-04/bh-jp-04-pdfs/bh-jp-04-seki.pdf
"""
def dump_NegotiateFlags(NegotiateFlags):
    if NegotiateFlags & NTLM_NegotiateUnicode:
        print "NTLM_NegotiateUnicode set"
    if NegotiateFlags & NTLM_NegotiateOEM:
        print "NTLM_NegotiateOEM set"                   
    if NegotiateFlags & NTLM_RequestTarget:
        print "NTLM_RequestTarget set"                  
    if NegotiateFlags & NTLM_Unknown9:
        print "NTLM_Unknown9 set"                       
    if NegotiateFlags & NTLM_NegotiateSign:
        print "NTLM_NegotiateSign set"                  
    if NegotiateFlags & NTLM_NegotiateSeal:
        print "NTLM_NegotiateSeal set"                  
    if NegotiateFlags & NTLM_NegotiateDatagram:
        print "NTLM_NegotiateDatagram set"              
    if NegotiateFlags & NTLM_NegotiateLanManagerKey:
        print "NTLM_NegotiateLanManagerKey set"
    if NegotiateFlags & NTLM_Unknown8:
        print "NTLM_Unknown8 set"                       
    if NegotiateFlags & NTLM_NegotiateNTLM:
        print "NTLM_NegotiateNTLM set"                  
    if NegotiateFlags & NTLM_NegotiateNTOnly:
        print "NTLM_NegotiateNTOnly set"                
    if NegotiateFlags & NTLM_Anonymous:
        print "NTLM_Anonymous set"                      
    if NegotiateFlags & NTLM_NegotiateOemDomainSupplied:
        print "NTLM_NegotiateOemDomainSupplied set"     
    if NegotiateFlags & NTLM_NegotiateOemWorkstationSupplied:
        print "NTLM_NegotiateOemWorkstationSupplied set"
    if NegotiateFlags & NTLM_Unknown6:
        print "NTLM_Unknown6 set"                       
    if NegotiateFlags & NTLM_NegotiateAlwaysSign:
        print "NTLM_NegotiateAlwaysSign set"            
    if NegotiateFlags & NTLM_TargetTypeDomain:
        print "NTLM_TargetTypeDomain set"               
    if NegotiateFlags & NTLM_TargetTypeServer:
        print "NTLM_TargetTypeServer set"               
    if NegotiateFlags & NTLM_TargetTypeShare:
        print "NTLM_TargetTypeShare set"                
    if NegotiateFlags & NTLM_NegotiateExtendedSecurity:
        print "NTLM_NegotiateExtendedSecurity set"      
    if NegotiateFlags & NTLM_NegotiateIdentify:
        print "NTLM_NegotiateIdentify set"              
    if NegotiateFlags & NTLM_Unknown5:
        print "NTLM_Unknown5 set"                       
    if NegotiateFlags & NTLM_RequestNonNTSessionKey:
        print "NTLM_RequestNonNTSessionKey set"         
    if NegotiateFlags & NTLM_NegotiateTargetInfo:
        print "NTLM_NegotiateTargetInfo set"            
    if NegotiateFlags & NTLM_Unknown4:
        print "NTLM_Unknown4 set"                       
    if NegotiateFlags & NTLM_NegotiateVersion:
        print "NTLM_NegotiateVersion set"               
    if NegotiateFlags & NTLM_Unknown3:
        print "NTLM_Unknown3 set"                       
    if NegotiateFlags & NTLM_Unknown2:
        print "NTLM_Unknown2 set"                       
    if NegotiateFlags & NTLM_Unknown1:
        print "NTLM_Unknown1 set"                       
    if NegotiateFlags & NTLM_Negotiate128:
        print "NTLM_Negotiate128 set"                   
    if NegotiateFlags & NTLM_NegotiateKeyExchange:
        print "NTLM_NegotiateKeyExchange set"           
    if NegotiateFlags & NTLM_Negotiate56:
        print "NTLM_Negotiate56 set"                    

def create_NTLM_NEGOTIATE_MESSAGE(user, type1_flags=NTLM_TYPE1_FLAGS):
    BODY_LENGTH = 40
    Payload_start = BODY_LENGTH # in bytes
    protocol = 'NTLMSSP\0'    #name        
    
    type = struct.pack('<I',1) #type 1
    
    flags =  struct.pack('<I', type1_flags)
    Workstation = gethostname().upper().encode('ascii')
    user_parts = user.split('\\', 1)
    if type1_flags & NTLM_NegotiateOemDomainSupplied:
        DomainName = user_parts[0].upper().encode('ascii')
    else:
        DomainName = ''
    EncryptedRandomSessionKey = ""
    
    
    WorkstationLen = struct.pack('<H', len(Workstation))
    WorkstationMaxLen = struct.pack('<H', len(Workstation))
    WorkstationBufferOffset = struct.pack('<I', Payload_start)
    Payload_start += len(Workstation)
    DomainNameLen = struct.pack('<H', len(DomainName))
    DomainNameMaxLen = struct.pack('<H', len(DomainName))
    DomainNameBufferOffset = struct.pack('<I',Payload_start)
    Payload_start += len(DomainName)
    ProductMajorVersion = struct.pack('<B', 5)
    ProductMinorVersion = struct.pack('<B', 1)
    ProductBuild = struct.pack('<H', 2600)
    VersionReserved1 = struct.pack('<B', 0)
    VersionReserved2 = struct.pack('<B', 0)
    VersionReserved3 = struct.pack('<B', 0)
    NTLMRevisionCurrent = struct.pack('<B', 15)
    
    msg1 = protocol + type + flags + \
            DomainNameLen + DomainNameMaxLen + DomainNameBufferOffset + \
            WorkstationLen + WorkstationMaxLen + WorkstationBufferOffset + \
            ProductMajorVersion + ProductMinorVersion + ProductBuild + \
            VersionReserved1 + VersionReserved2 + VersionReserved3 + NTLMRevisionCurrent
    assert BODY_LENGTH==len(msg1), "BODY_LENGTH: %d != msg1: %d" % (BODY_LENGTH,len(msg1))
    msg1 += Workstation + DomainName
    msg1 = base64.encodestring(msg1)
    msg1 = string.replace(msg1, '\n', '')
    return msg1
    
def parse_NTLM_CHALLENGE_MESSAGE(msg2):
    ""
    msg2 = base64.decodestring(msg2)
    Signature = msg2[0:8]
    msg_type = struct.unpack("<I",msg2[8:12])[0]
    assert(msg_type==2)
    TargetNameLen = struct.unpack("<H",msg2[12:14])[0]
    TargetNameMaxLen = struct.unpack("<H",msg2[14:16])[0]
    TargetNameOffset = struct.unpack("<I",msg2[16:20])[0]
    TargetName = msg2[TargetNameOffset:TargetNameOffset+TargetNameMaxLen]
    NegotiateFlags = struct.unpack("<I",msg2[20:24])[0]
    ServerChallenge = msg2[24:32]
    Reserved = msg2[32:40]
    # Fixes some NTLM auth that don't include the target info
    # I have no idea if such a server is broken or not, but
    # this helped with my testing
    if TargetNameOffset > 40:
        TargetInfoLen = struct.unpack("<H",msg2[40:42])[0]
        TargetInfoMaxLen = struct.unpack("<H",msg2[42:44])[0]
        TargetInfoOffset = struct.unpack("<I",msg2[44:48])[0]
        TargetInfo = msg2[TargetInfoOffset:TargetInfoOffset+TargetInfoLen]
        i=0
        TimeStamp = '\0'*8
        while(i<TargetInfoLen):
            AvId = struct.unpack("<H",TargetInfo[i:i+2])[0]
            AvLen = struct.unpack("<H",TargetInfo[i+2:i+4])[0]
            AvValue = TargetInfo[i+4:i+4+AvLen]
            i = i+4+AvLen
            if AvId == NTLM_MsvAvTimestamp:
                TimeStamp = AvValue 
            #~ print AvId, AvValue.decode('utf-16')
    return (ServerChallenge, NegotiateFlags)

def create_NTLM_AUTHENTICATE_MESSAGE(nonce, user, domain, password, NegotiateFlags):
    ""
    is_unicode  = NegotiateFlags & NTLM_NegotiateUnicode
    is_NegotiateExtendedSecurity = NegotiateFlags & NTLM_NegotiateExtendedSecurity
    
    flags =  struct.pack('<I',NTLM_TYPE2_FLAGS)

    BODY_LENGTH = 72
    Payload_start = BODY_LENGTH # in bytes

    Workstation = gethostname().upper()
    DomainName = domain.upper()
    UserName = user
    EncryptedRandomSessionKey = ""
    if is_unicode:
        Workstation = Workstation.encode('utf-16-le')
        DomainName = DomainName.encode('utf-16-le')
        UserName = UserName.encode('utf-16-le')
        EncryptedRandomSessionKey = EncryptedRandomSessionKey.encode('utf-16-le')
    LmChallengeResponse = calc_resp(create_LM_hashed_password_v1(password), nonce)
    NtChallengeResponse = calc_resp(create_NT_hashed_password_v1(password), nonce)
    
    if is_NegotiateExtendedSecurity:
        pwhash = create_NT_hashed_password_v1(password, UserName, DomainName)
        ClientChallenge = ""
        for i in range(8):
           ClientChallenge+= chr(random.getrandbits(8))
        (NtChallengeResponse, LmChallengeResponse) = ntlm2sr_calc_resp(pwhash, nonce, ClientChallenge) #='\x39 e3 f4 cd 59 c5 d8 60')
    Signature = 'NTLMSSP\0'           
    MessageType = struct.pack('<I',3)  #type 3
    
    DomainNameLen = struct.pack('<H', len(DomainName))
    DomainNameMaxLen = struct.pack('<H', len(DomainName))
    DomainNameOffset = struct.pack('<I', Payload_start)
    Payload_start += len(DomainName)
    
    UserNameLen = struct.pack('<H', len(UserName))
    UserNameMaxLen = struct.pack('<H', len(UserName))
    UserNameOffset = struct.pack('<I', Payload_start)
    Payload_start += len(UserName)
    
    WorkstationLen = struct.pack('<H', len(Workstation))
    WorkstationMaxLen = struct.pack('<H', len(Workstation))
    WorkstationOffset = struct.pack('<I', Payload_start)
    Payload_start += len(Workstation)
    
    
    LmChallengeResponseLen = struct.pack('<H', len(LmChallengeResponse))
    LmChallengeResponseMaxLen = struct.pack('<H', len(LmChallengeResponse))
    LmChallengeResponseOffset = struct.pack('<I', Payload_start)
    Payload_start += len(LmChallengeResponse)
    
    NtChallengeResponseLen = struct.pack('<H', len(NtChallengeResponse))
    NtChallengeResponseMaxLen = struct.pack('<H', len(NtChallengeResponse))
    NtChallengeResponseOffset = struct.pack('<I', Payload_start)
    Payload_start += len(NtChallengeResponse)
    
    EncryptedRandomSessionKeyLen = struct.pack('<H', len(EncryptedRandomSessionKey))
    EncryptedRandomSessionKeyMaxLen = struct.pack('<H', len(EncryptedRandomSessionKey))
    EncryptedRandomSessionKeyOffset = struct.pack('<I',Payload_start)
    Payload_start +=  len(EncryptedRandomSessionKey)
    NegotiateFlags = flags
    
    ProductMajorVersion = struct.pack('<B', 5)
    ProductMinorVersion = struct.pack('<B', 1)
    ProductBuild = struct.pack('<H', 2600)
    VersionReserved1 = struct.pack('<B', 0)
    VersionReserved2 = struct.pack('<B', 0)
    VersionReserved3 = struct.pack('<B', 0)
    NTLMRevisionCurrent = struct.pack('<B', 15)
    
    MIC = struct.pack('<IIII',0,0,0,0)
    msg3 = Signature + MessageType + \
            LmChallengeResponseLen + LmChallengeResponseMaxLen + LmChallengeResponseOffset + \
            NtChallengeResponseLen + NtChallengeResponseMaxLen + NtChallengeResponseOffset + \
            DomainNameLen + DomainNameMaxLen + DomainNameOffset + \
            UserNameLen + UserNameMaxLen + UserNameOffset + \
            WorkstationLen + WorkstationMaxLen + WorkstationOffset + \
            EncryptedRandomSessionKeyLen + EncryptedRandomSessionKeyMaxLen + EncryptedRandomSessionKeyOffset + \
            NegotiateFlags + \
            ProductMajorVersion + ProductMinorVersion + ProductBuild + \
            VersionReserved1 + VersionReserved2 + VersionReserved3 + NTLMRevisionCurrent
    assert BODY_LENGTH==len(msg3), "BODY_LENGTH: %d != msg3: %d" % (BODY_LENGTH,len(msg3))
    Payload = DomainName + UserName + Workstation + LmChallengeResponse + NtChallengeResponse + EncryptedRandomSessionKey
    msg3 += Payload
    msg3 = base64.encodestring(msg3)
    msg3 = string.replace(msg3, '\n', '')
    return msg3
            
def calc_resp(password_hash, server_challenge):
    """calc_resp generates the LM response given a 16-byte password hash and the
        challenge from the Type-2 message.
        @param password_hash
            16-byte password hash
        @param server_challenge
            8-byte challenge from Type-2 message
        returns
            24-byte buffer to contain the LM response upon return
    """
    # padding with zeros to make the hash 21 bytes long
    password_hash = password_hash + '\0' * (21 - len(password_hash))
    res = ''
    dobj = des.DES(password_hash[0:7])
    res = res + dobj.encrypt(server_challenge[0:8])

    dobj = des.DES(password_hash[7:14])
    res = res + dobj.encrypt(server_challenge[0:8])

    dobj = des.DES(password_hash[14:21])
    res = res + dobj.encrypt(server_challenge[0:8])
    return res
    
def ComputeResponse(ResponseKeyNT, ResponseKeyLM, ServerChallenge, ServerName, ClientChallenge='\xaa'*8, Time='\0'*8):
    LmChallengeResponse = hmac.new(ResponseKeyLM, ServerChallenge+ClientChallenge).digest() + ClientChallenge
    
    Responserversion = '\x01'
    HiResponserversion = '\x01'
    temp = Responserversion + HiResponserversion + '\0'*6 + Time + ClientChallenge + '\0'*4 + ServerChallenge + '\0'*4 
    NTProofStr  = hmac.new(ResponseKeyNT, ServerChallenge + temp).digest()
    NtChallengeResponse = NTProofStr + temp
    
    SessionBaseKey = hmac.new(ResponseKeyNT, NTProofStr).digest()
    return (NtChallengeResponse, LmChallengeResponse)

def ntlm2sr_calc_resp(ResponseKeyNT, ServerChallenge, ClientChallenge='\xaa'*8):
    import hashlib
    LmChallengeResponse = ClientChallenge + '\0'*16
    sess = hashlib.md5(ServerChallenge+ClientChallenge).digest()
    NtChallengeResponse = calc_resp(ResponseKeyNT, sess[0:8])
    return (NtChallengeResponse, LmChallengeResponse)

def create_LM_hashed_password_v1(passwd):
    "setup LanManager password"
    "create LanManager hashed password"
    
    # fix the password length to 14 bytes
    passwd = string.upper(passwd)
    lm_pw = passwd + '\0' * (14 - len(passwd))
    lm_pw = passwd[0:14]

    # do hash
    magic_str = "KGS!@#$%" # page 57 in [MS-NLMP]

    res = ''
    dobj = des.DES(lm_pw[0:7])
    res = res + dobj.encrypt(magic_str)

    dobj = des.DES(lm_pw[7:14])
    res = res + dobj.encrypt(magic_str)

    return res
    
def create_NT_hashed_password_v1(passwd, user=None, domain=None):
    "create NT hashed password"
    digest = hashlib.new('md4', passwd.encode('utf-16le')).digest()
    return digest

def create_NT_hashed_password_v2(passwd, user, domain):
    "create NT hashed password"
    digest = create_NT_hashed_password_v1(passwd)
    
    return hmac.new(digest, (user.upper()+domain).encode('utf-16le')).digest()
    return digest
    
def create_sessionbasekey(password):
    return hashlib.new('md4', create_NT_hashed_password_v1(password)).digest()

if __name__ == "__main__":
    def ByteToHex( byteStr ):
        """
        Convert a byte string to it's hex string representation e.g. for output.
        """
        return ' '.join( [ "%02X" % ord( x ) for x in byteStr ] )

    def HexToByte( hexStr ):
        """
        Convert a string hex byte values into a byte string. The Hex Byte values may
        or may not be space separated.
        """
        bytes = []

        hexStr = ''.join( hexStr.split(" ") )

        for i in range(0, len(hexStr), 2):
            bytes.append( chr( int (hexStr[i:i+2], 16 ) ) )

        return ''.join( bytes )
        
    ServerChallenge = HexToByte("01 23 45 67 89 ab cd ef")
    ClientChallenge = '\xaa'*8
    Time = '\x00'*8
    Workstation = "COMPUTER".encode('utf-16-le')
    ServerName = "Server".encode('utf-16-le')
    User = "User"
    Domain = "Domain"
    Password = "Password"
    RandomSessionKey = '\55'*16
    assert HexToByte("e5 2c ac 67 41 9a 9a 22 4a 3b 10 8f 3f a6 cb 6d") == create_LM_hashed_password_v1(Password)                  # [MS-NLMP] page 72
    assert HexToByte("a4 f4 9c 40 65 10 bd ca b6 82 4e e7 c3 0f d8 52") == create_NT_hashed_password_v1(Password)    # [MS-NLMP] page 73
    assert HexToByte("d8 72 62 b0 cd e4 b1 cb 74 99 be cc cd f1 07 84") == create_sessionbasekey(Password)
    assert HexToByte("67 c4 30 11 f3 02 98 a2 ad 35 ec e6 4f 16 33 1c 44 bd be d9 27 84 1f 94") == calc_resp(create_NT_hashed_password_v1(Password), ServerChallenge)
    assert HexToByte("98 de f7 b8 7f 88 aa 5d af e2 df 77 96 88 a1 72 de f1 1c 7d 5c cd ef 13") == calc_resp(create_LM_hashed_password_v1(Password), ServerChallenge)
    
    (NTLMv1Response,LMv1Response) = ntlm2sr_calc_resp(create_NT_hashed_password_v1(Password), ServerChallenge, ClientChallenge)
    assert HexToByte("aa aa aa aa aa aa aa aa 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00") == LMv1Response  # [MS-NLMP] page 75
    assert HexToByte("75 37 f8 03 ae 36 71 28 ca 45 82 04 bd e7 ca f8 1e 97 ed 26 83 26 72 32") == NTLMv1Response
    
    assert HexToByte("0c 86 8a 40 3b fd 7a 93 a3 00 1e f2 2e f0 2e 3f") == create_NT_hashed_password_v2(Password, User, Domain)    # [MS-NLMP] page 76
    ResponseKeyLM = ResponseKeyNT = create_NT_hashed_password_v2(Password, User, Domain)
    (NTLMv2Response,LMv2Response) = ComputeResponse(ResponseKeyNT, ResponseKeyLM, ServerChallenge, ServerName, ClientChallenge, Time)
    assert HexToByte("86 c3 50 97 ac 9c ec 10 25 54 76 4a 57 cc cc 19 aa aa aa aa aa aa aa aa") == LMv2Response  # [MS-NLMP] page 76
    
    # expected failure
    # According to the spec in section '3.3.2 NTLM v2 Authentication' the NTLMv2Response should be longer than the value given on page 77 (this suggests a mistake in the spec)
    #~ assert HexToByte("68 cd 0a b8 51 e5 1c 96 aa bc 92 7b eb ef 6a 1c") == NTLMv2Response, "\nExpected: 68 cd 0a b8 51 e5 1c 96 aa bc 92 7b eb ef 6a 1c\nActual:   %s" % ByteToHex(NTLMv2Response) # [MS-NLMP] page 77
    
