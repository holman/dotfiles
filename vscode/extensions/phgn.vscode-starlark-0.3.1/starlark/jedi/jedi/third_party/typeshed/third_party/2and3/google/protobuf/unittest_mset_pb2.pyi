from google.protobuf.internal.containers import (
    RepeatedCompositeFieldContainer,
)
from google.protobuf.message import (
    Message,
)
from google.protobuf.unittest_mset_wire_format_pb2 import (
    TestMessageSet,
)
import builtins
from typing import (
    Iterable,
    Optional,
    Text,
)


class TestMessageSetContainer(Message):

    @property
    def message_set(self) -> TestMessageSet: ...

    def __init__(self,
                 message_set: Optional[TestMessageSet] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> TestMessageSetContainer: ...


class TestMessageSetExtension1(Message):
    i: int

    def __init__(self,
                 i: Optional[int] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> TestMessageSetExtension1: ...


class TestMessageSetExtension2(Message):
    str: Text

    def __init__(self,
                 bytes: Optional[Text] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: builtins.bytes) -> TestMessageSetExtension2: ...


class RawMessageSet(Message):

    class Item(Message):
        type_id: int
        message: bytes

        def __init__(self,
                     type_id: int,
                     message: bytes,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> RawMessageSet.Item: ...

    @property
    def item(self) -> RepeatedCompositeFieldContainer[RawMessageSet.Item]: ...

    def __init__(self,
                 item: Optional[Iterable[RawMessageSet.Item]] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> RawMessageSet: ...
