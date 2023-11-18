from google.protobuf.message import (
    Message,
)
from google.protobuf.unittest_no_arena_pb2 import (
    ForeignMessage,
)
from google.protobuf.unittest_pb2 import (
    ForeignMessage as ForeignMessage1,
    TestAllTypes,
    TestRequired,
)
from typing import (
    List,
    Mapping,
    MutableMapping,
    Optional,
    Text,
    Tuple,
    cast,
)


class MapEnum(int):

    @classmethod
    def Name(cls, number: int) -> bytes: ...

    @classmethod
    def Value(cls, name: bytes) -> MapEnum: ...

    @classmethod
    def keys(cls) -> List[bytes]: ...

    @classmethod
    def values(cls) -> List[MapEnum]: ...

    @classmethod
    def items(cls) -> List[Tuple[bytes, MapEnum]]: ...


MAP_ENUM_FOO: MapEnum
MAP_ENUM_BAR: MapEnum
MAP_ENUM_BAZ: MapEnum


class TestMap(Message):

    class MapInt32Int32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapInt32Int32Entry: ...

    class MapInt64Int64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapInt64Int64Entry: ...

    class MapUint32Uint32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapUint32Uint32Entry: ...

    class MapUint64Uint64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapUint64Uint64Entry: ...

    class MapSint32Sint32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapSint32Sint32Entry: ...

    class MapSint64Sint64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapSint64Sint64Entry: ...

    class MapFixed32Fixed32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapFixed32Fixed32Entry: ...

    class MapFixed64Fixed64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapFixed64Fixed64Entry: ...

    class MapSfixed32Sfixed32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapSfixed32Sfixed32Entry: ...

    class MapSfixed64Sfixed64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapSfixed64Sfixed64Entry: ...

    class MapInt32FloatEntry(Message):
        key: int
        value: float

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[float] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapInt32FloatEntry: ...

    class MapInt32DoubleEntry(Message):
        key: int
        value: float

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[float] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapInt32DoubleEntry: ...

    class MapBoolBoolEntry(Message):
        key: bool
        value: bool

        def __init__(self,
                     key: Optional[bool] = ...,
                     value: Optional[bool] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapBoolBoolEntry: ...

    class MapStringStringEntry(Message):
        key: Text
        value: Text

        def __init__(self,
                     key: Optional[Text] = ...,
                     value: Optional[Text] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapStringStringEntry: ...

    class MapInt32BytesEntry(Message):
        key: int
        value: bytes

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[bytes] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapInt32BytesEntry: ...

    class MapInt32EnumEntry(Message):
        key: int
        value: MapEnum

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[MapEnum] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapInt32EnumEntry: ...

    class MapInt32ForeignMessageEntry(Message):
        key: int

        @property
        def value(self) -> ForeignMessage1: ...

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[ForeignMessage1] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapInt32ForeignMessageEntry: ...

    class MapStringForeignMessageEntry(Message):
        key: Text

        @property
        def value(self) -> ForeignMessage1: ...

        def __init__(self,
                     key: Optional[Text] = ...,
                     value: Optional[ForeignMessage1] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(
            cls, s: bytes) -> TestMap.MapStringForeignMessageEntry: ...

    class MapInt32AllTypesEntry(Message):
        key: int

        @property
        def value(self) -> TestAllTypes: ...

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[TestAllTypes] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMap.MapInt32AllTypesEntry: ...

    @property
    def map_int32_int32(self) -> MutableMapping[int, int]: ...

    @property
    def map_int64_int64(self) -> MutableMapping[int, int]: ...

    @property
    def map_uint32_uint32(self) -> MutableMapping[int, int]: ...

    @property
    def map_uint64_uint64(self) -> MutableMapping[int, int]: ...

    @property
    def map_sint32_sint32(self) -> MutableMapping[int, int]: ...

    @property
    def map_sint64_sint64(self) -> MutableMapping[int, int]: ...

    @property
    def map_fixed32_fixed32(self) -> MutableMapping[int, int]: ...

    @property
    def map_fixed64_fixed64(self) -> MutableMapping[int, int]: ...

    @property
    def map_sfixed32_sfixed32(self) -> MutableMapping[int, int]: ...

    @property
    def map_sfixed64_sfixed64(self) -> MutableMapping[int, int]: ...

    @property
    def map_int32_float(self) -> MutableMapping[int, float]: ...

    @property
    def map_int32_double(self) -> MutableMapping[int, float]: ...

    @property
    def map_bool_bool(self) -> MutableMapping[bool, bool]: ...

    @property
    def map_string_string(self) -> MutableMapping[Text, Text]: ...

    @property
    def map_int32_bytes(self) -> MutableMapping[int, bytes]: ...

    @property
    def map_int32_enum(self) -> MutableMapping[int, MapEnum]: ...

    @property
    def map_int32_foreign_message(
        self) -> MutableMapping[int, ForeignMessage1]: ...

    @property
    def map_string_foreign_message(
        self) -> MutableMapping[Text, ForeignMessage1]: ...

    @property
    def map_int32_all_types(self) -> MutableMapping[int, TestAllTypes]: ...

    def __init__(self,
                 map_int32_int32: Optional[Mapping[int, int]] = ...,
                 map_int64_int64: Optional[Mapping[int, int]] = ...,
                 map_uint32_uint32: Optional[Mapping[int, int]] = ...,
                 map_uint64_uint64: Optional[Mapping[int, int]] = ...,
                 map_sint32_sint32: Optional[Mapping[int, int]] = ...,
                 map_sint64_sint64: Optional[Mapping[int, int]] = ...,
                 map_fixed32_fixed32: Optional[Mapping[int, int]] = ...,
                 map_fixed64_fixed64: Optional[Mapping[int, int]] = ...,
                 map_sfixed32_sfixed32: Optional[Mapping[int, int]] = ...,
                 map_sfixed64_sfixed64: Optional[Mapping[int, int]] = ...,
                 map_int32_float: Optional[Mapping[int, float]] = ...,
                 map_int32_double: Optional[Mapping[int, float]] = ...,
                 map_bool_bool: Optional[Mapping[bool, bool]] = ...,
                 map_string_string: Optional[Mapping[Text, Text]] = ...,
                 map_int32_bytes: Optional[Mapping[int, bytes]] = ...,
                 map_int32_enum: Optional[Mapping[int, MapEnum]] = ...,
                 map_int32_foreign_message: Optional[Mapping[int, ForeignMessage1]] = ...,
                 map_string_foreign_message: Optional[Mapping[Text, ForeignMessage1]] = ...,
                 map_int32_all_types: Optional[Mapping[int, TestAllTypes]] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> TestMap: ...


class TestMapSubmessage(Message):

    @property
    def test_map(self) -> TestMap: ...

    def __init__(self,
                 test_map: Optional[TestMap] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> TestMapSubmessage: ...


class TestMessageMap(Message):

    class MapInt32MessageEntry(Message):
        key: int

        @property
        def value(self) -> TestAllTypes: ...

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[TestAllTypes] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestMessageMap.MapInt32MessageEntry: ...

    @property
    def map_int32_message(self) -> MutableMapping[int, TestAllTypes]: ...

    def __init__(self,
                 map_int32_message: Optional[Mapping[int, TestAllTypes]] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> TestMessageMap: ...


class TestSameTypeMap(Message):

    class Map1Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestSameTypeMap.Map1Entry: ...

    class Map2Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestSameTypeMap.Map2Entry: ...

    @property
    def map1(self) -> MutableMapping[int, int]: ...

    @property
    def map2(self) -> MutableMapping[int, int]: ...

    def __init__(self,
                 map1: Optional[Mapping[int, int]] = ...,
                 map2: Optional[Mapping[int, int]] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> TestSameTypeMap: ...


class TestRequiredMessageMap(Message):

    class MapFieldEntry(Message):
        key: int

        @property
        def value(self) -> TestRequired: ...

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[TestRequired] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(
            cls, s: bytes) -> TestRequiredMessageMap.MapFieldEntry: ...

    @property
    def map_field(self) -> MutableMapping[int, TestRequired]: ...

    def __init__(self,
                 map_field: Optional[Mapping[int, TestRequired]] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> TestRequiredMessageMap: ...


class TestArenaMap(Message):

    class MapInt32Int32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapInt32Int32Entry: ...

    class MapInt64Int64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapInt64Int64Entry: ...

    class MapUint32Uint32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapUint32Uint32Entry: ...

    class MapUint64Uint64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapUint64Uint64Entry: ...

    class MapSint32Sint32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapSint32Sint32Entry: ...

    class MapSint64Sint64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapSint64Sint64Entry: ...

    class MapFixed32Fixed32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapFixed32Fixed32Entry: ...

    class MapFixed64Fixed64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapFixed64Fixed64Entry: ...

    class MapSfixed32Sfixed32Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(
            cls, s: bytes) -> TestArenaMap.MapSfixed32Sfixed32Entry: ...

    class MapSfixed64Sfixed64Entry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(
            cls, s: bytes) -> TestArenaMap.MapSfixed64Sfixed64Entry: ...

    class MapInt32FloatEntry(Message):
        key: int
        value: float

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[float] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapInt32FloatEntry: ...

    class MapInt32DoubleEntry(Message):
        key: int
        value: float

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[float] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapInt32DoubleEntry: ...

    class MapBoolBoolEntry(Message):
        key: bool
        value: bool

        def __init__(self,
                     key: Optional[bool] = ...,
                     value: Optional[bool] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapBoolBoolEntry: ...

    class MapStringStringEntry(Message):
        key: Text
        value: Text

        def __init__(self,
                     key: Optional[Text] = ...,
                     value: Optional[Text] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapStringStringEntry: ...

    class MapInt32BytesEntry(Message):
        key: int
        value: bytes

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[bytes] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapInt32BytesEntry: ...

    class MapInt32EnumEntry(Message):
        key: int
        value: MapEnum

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[MapEnum] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestArenaMap.MapInt32EnumEntry: ...

    class MapInt32ForeignMessageEntry(Message):
        key: int

        @property
        def value(self) -> ForeignMessage1: ...

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[ForeignMessage1] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(
            cls, s: bytes) -> TestArenaMap.MapInt32ForeignMessageEntry: ...

    class MapInt32ForeignMessageNoArenaEntry(Message):
        key: int

        @property
        def value(self) -> ForeignMessage: ...

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[ForeignMessage] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(
            cls, s: bytes) -> TestArenaMap.MapInt32ForeignMessageNoArenaEntry: ...

    @property
    def map_int32_int32(self) -> MutableMapping[int, int]: ...

    @property
    def map_int64_int64(self) -> MutableMapping[int, int]: ...

    @property
    def map_uint32_uint32(self) -> MutableMapping[int, int]: ...

    @property
    def map_uint64_uint64(self) -> MutableMapping[int, int]: ...

    @property
    def map_sint32_sint32(self) -> MutableMapping[int, int]: ...

    @property
    def map_sint64_sint64(self) -> MutableMapping[int, int]: ...

    @property
    def map_fixed32_fixed32(self) -> MutableMapping[int, int]: ...

    @property
    def map_fixed64_fixed64(self) -> MutableMapping[int, int]: ...

    @property
    def map_sfixed32_sfixed32(self) -> MutableMapping[int, int]: ...

    @property
    def map_sfixed64_sfixed64(self) -> MutableMapping[int, int]: ...

    @property
    def map_int32_float(self) -> MutableMapping[int, float]: ...

    @property
    def map_int32_double(self) -> MutableMapping[int, float]: ...

    @property
    def map_bool_bool(self) -> MutableMapping[bool, bool]: ...

    @property
    def map_string_string(self) -> MutableMapping[Text, Text]: ...

    @property
    def map_int32_bytes(self) -> MutableMapping[int, bytes]: ...

    @property
    def map_int32_enum(self) -> MutableMapping[int, MapEnum]: ...

    @property
    def map_int32_foreign_message(
        self) -> MutableMapping[int, ForeignMessage1]: ...

    @property
    def map_int32_foreign_message_no_arena(
        self) -> MutableMapping[int, ForeignMessage]: ...

    def __init__(self,
                 map_int32_int32: Optional[Mapping[int, int]] = ...,
                 map_int64_int64: Optional[Mapping[int, int]] = ...,
                 map_uint32_uint32: Optional[Mapping[int, int]] = ...,
                 map_uint64_uint64: Optional[Mapping[int, int]] = ...,
                 map_sint32_sint32: Optional[Mapping[int, int]] = ...,
                 map_sint64_sint64: Optional[Mapping[int, int]] = ...,
                 map_fixed32_fixed32: Optional[Mapping[int, int]] = ...,
                 map_fixed64_fixed64: Optional[Mapping[int, int]] = ...,
                 map_sfixed32_sfixed32: Optional[Mapping[int, int]] = ...,
                 map_sfixed64_sfixed64: Optional[Mapping[int, int]] = ...,
                 map_int32_float: Optional[Mapping[int, float]] = ...,
                 map_int32_double: Optional[Mapping[int, float]] = ...,
                 map_bool_bool: Optional[Mapping[bool, bool]] = ...,
                 map_string_string: Optional[Mapping[Text, Text]] = ...,
                 map_int32_bytes: Optional[Mapping[int, bytes]] = ...,
                 map_int32_enum: Optional[Mapping[int, MapEnum]] = ...,
                 map_int32_foreign_message: Optional[Mapping[int, ForeignMessage1]] = ...,
                 map_int32_foreign_message_no_arena: Optional[Mapping[int, ForeignMessage]] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> TestArenaMap: ...


class MessageContainingEnumCalledType(Message):

    class Type(int):

        @classmethod
        def Name(cls, number: int) -> bytes: ...

        @classmethod
        def Value(cls, name: bytes) -> MessageContainingEnumCalledType.Type: ...

        @classmethod
        def keys(cls) -> List[bytes]: ...

        @classmethod
        def values(cls) -> List[MessageContainingEnumCalledType.Type]: ...

        @classmethod
        def items(cls) -> List[Tuple[bytes,
                                     MessageContainingEnumCalledType.Type]]: ...
    TYPE_FOO: MessageContainingEnumCalledType.Type

    class TypeEntry(Message):
        key: Text

        @property
        def value(self) -> MessageContainingEnumCalledType: ...

        def __init__(self,
                     key: Optional[Text] = ...,
                     value: Optional[MessageContainingEnumCalledType] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(
            cls, s: bytes) -> MessageContainingEnumCalledType.TypeEntry: ...

    @property
    def type(self) -> MutableMapping[Text,
                                     MessageContainingEnumCalledType]: ...

    def __init__(self,
                 type: Optional[Mapping[Text, MessageContainingEnumCalledType]] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> MessageContainingEnumCalledType: ...


class MessageContainingMapCalledEntry(Message):

    class EntryEntry(Message):
        key: int
        value: int

        def __init__(self,
                     key: Optional[int] = ...,
                     value: Optional[int] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(
            cls, s: bytes) -> MessageContainingMapCalledEntry.EntryEntry: ...

    @property
    def entry(self) -> MutableMapping[int, int]: ...

    def __init__(self,
                 entry: Optional[Mapping[int, int]] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> MessageContainingMapCalledEntry: ...


class TestRecursiveMapMessage(Message):

    class AEntry(Message):
        key: Text

        @property
        def value(self) -> TestRecursiveMapMessage: ...

        def __init__(self,
                     key: Optional[Text] = ...,
                     value: Optional[TestRecursiveMapMessage] = ...,
                     ) -> None: ...

        @classmethod
        def FromString(cls, s: bytes) -> TestRecursiveMapMessage.AEntry: ...

    @property
    def a(self) -> MutableMapping[Text, TestRecursiveMapMessage]: ...

    def __init__(self,
                 a: Optional[Mapping[Text, TestRecursiveMapMessage]] = ...,
                 ) -> None: ...

    @classmethod
    def FromString(cls, s: bytes) -> TestRecursiveMapMessage: ...
