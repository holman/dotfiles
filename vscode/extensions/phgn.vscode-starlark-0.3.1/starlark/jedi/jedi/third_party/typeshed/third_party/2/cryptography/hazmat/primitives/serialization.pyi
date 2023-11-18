from typing import Any, Optional
from enum import Enum

def load_pem_private_key(data: bytes, password: Optional[bytes], backend): ...
def load_pem_public_key(data: bytes, backend): ...
def load_der_private_key(data: bytes, password: Optional[bytes], backend): ...
def load_der_public_key(data: bytes, backend): ...
def load_ssh_public_key(data: bytes, backend): ...

class Encoding(Enum):
    PEM: str
    DER: str
    OpenSSH: str

class PrivateFormat(Enum):
    PKCS8: str
    TraditionalOpenSSL: str

class PublicFormat(Enum):
    SubjectPublicKeyInfo: str
    PKCS1: str
    OpenSSH: str

class ParameterFormat(Enum):
    PKCS3: str

class KeySerializationEncryption: ...

class BestAvailableEncryption(KeySerializationEncryption):
    password: Any
    def __init__(self, password) -> None: ...

class NoEncryption(KeySerializationEncryption): ...
