from google.protobuf.message import (
    Message,
)
from typing import (
    Optional,
    Text,
)


class DoubleValue(Message):
    value: float

    def __init__(self,
                 value: Optional[float] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> DoubleValue: ...


class FloatValue(Message):
    value: float

    def __init__(self,
                 value: Optional[float] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> FloatValue: ...


class Int64Value(Message):
    value: int

    def __init__(self,
                 value: Optional[int] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> Int64Value: ...


class UInt64Value(Message):
    value: int

    def __init__(self,
                 value: Optional[int] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> UInt64Value: ...


class Int32Value(Message):
    value: int

    def __init__(self,
                 value: Optional[int] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> Int32Value: ...


class UInt32Value(Message):
    value: int

    def __init__(self,
                 value: Optional[int] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> UInt32Value: ...


class BoolValue(Message):
    value: bool

    def __init__(self,
                 value: Optional[bool] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> BoolValue: ...


class StringValue(Message):
    value: Text

    def __init__(self,
                 value: Optional[Text] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> StringValue: ...


class BytesValue(Message):
    value: bytes

    def __init__(self,
                 value: Optional[bytes] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> BytesValue: ...
