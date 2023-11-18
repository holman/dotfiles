from typing import Any, Dict, Tuple, List, Text, NoReturn, Optional, Protocol, Type, Union, Iterable

from wsgiref.types import WSGIEnvironment, StartResponse
from werkzeug.wrappers import Response

class _EnvironContainer(Protocol):
    @property
    def environ(self) -> WSGIEnvironment: ...

class HTTPException(Exception):
    code: Optional[int]
    description: Optional[str]
    response: Optional[Response]
    def __init__(self, description: Optional[str] = ..., response: Optional[Response] = ...) -> None: ...
    @classmethod
    def wrap(cls, exception: Type[Exception], name: Optional[str] = ...) -> Any: ...
    @property
    def name(self) -> str: ...
    def get_description(self, environ: Optional[WSGIEnvironment] = ...) -> Text: ...
    def get_body(self, environ: Optional[WSGIEnvironment] = ...) -> Text: ...
    def get_headers(self, environ: Optional[WSGIEnvironment] = ...) -> List[Tuple[str, str]]: ...
    def get_response(self, environ: Optional[Union[WSGIEnvironment, _EnvironContainer]] = ...) -> Response: ...
    def __call__(self, environ: WSGIEnvironment, start_response: StartResponse) -> Iterable[bytes]: ...

default_exceptions: Dict[int, Type[HTTPException]]

class BadRequest(HTTPException):
    code: int
    description: str

class ClientDisconnected(BadRequest): ...
class SecurityError(BadRequest): ...
class BadHost(BadRequest): ...

class Unauthorized(HTTPException):
    code: int
    description: str

class Forbidden(HTTPException):
    code: int
    description: str

class NotFound(HTTPException):
    code: int
    description: str

class MethodNotAllowed(HTTPException):
    code: int
    description: str
    valid_methods: Any
    def __init__(self, valid_methods: Optional[Any] = ..., description: Optional[Any] = ...): ...
    def get_headers(self, environ): ...

class NotAcceptable(HTTPException):
    code: int
    description: str

class RequestTimeout(HTTPException):
    code: int
    description: str

class Conflict(HTTPException):
    code: int
    description: str

class Gone(HTTPException):
    code: int
    description: str

class LengthRequired(HTTPException):
    code: int
    description: str

class PreconditionFailed(HTTPException):
    code: int
    description: str

class RequestEntityTooLarge(HTTPException):
    code: int
    description: str

class RequestURITooLarge(HTTPException):
    code: int
    description: str

class UnsupportedMediaType(HTTPException):
    code: int
    description: str

class RequestedRangeNotSatisfiable(HTTPException):
    code: int
    description: str
    length: Any
    units: str
    def __init__(self, length: Optional[Any] = ..., units: str = ..., description: Optional[Any] = ...): ...
    def get_headers(self, environ): ...

class ExpectationFailed(HTTPException):
    code: int
    description: str

class ImATeapot(HTTPException):
    code: int
    description: str

class UnprocessableEntity(HTTPException):
    code: int
    description: str

class Locked(HTTPException):
    code: int
    description: str

class PreconditionRequired(HTTPException):
    code: int
    description: str

class TooManyRequests(HTTPException):
    code: int
    description: str

class RequestHeaderFieldsTooLarge(HTTPException):
    code: int
    description: str

class UnavailableForLegalReasons(HTTPException):
    code: int
    description: str

class InternalServerError(HTTPException):
    code: int
    description: str

class NotImplemented(HTTPException):
    code: int
    description: str

class BadGateway(HTTPException):
    code: int
    description: str

class ServiceUnavailable(HTTPException):
    code: int
    description: str

class GatewayTimeout(HTTPException):
    code: int
    description: str

class HTTPVersionNotSupported(HTTPException):
    code: int
    description: str

class Aborter:
    mapping: Any
    def __init__(self, mapping: Optional[Any] = ..., extra: Optional[Any] = ...) -> None: ...
    def __call__(self, code: Union[int, Response], *args: Any, **kwargs: Any) -> NoReturn: ...

def abort(status: Union[int, Response], *args: Any, **kwargs: Any) -> NoReturn: ...

class BadRequestKeyError(BadRequest, KeyError): ...
