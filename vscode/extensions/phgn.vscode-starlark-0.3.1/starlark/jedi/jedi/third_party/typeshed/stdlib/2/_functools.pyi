"""Stub file for the '_functools' module."""

from typing import Any, Callable, Dict, Iterable, Optional, TypeVar, Tuple, overload

_T = TypeVar("_T")
_T2 = TypeVar("_T2")
_T3 = TypeVar("_T3")
_T4 = TypeVar("_T4")
_T5 = TypeVar("_T5")
_S = TypeVar("_S")

@overload
def reduce(function: Callable[[_T, _T], _T],
           sequence: Iterable[_T]) -> _T: ...
@overload
def reduce(function: Callable[[_T, _S], _T],
           sequence: Iterable[_S], initial: _T) -> _T: ...

@overload
def partial(__func: Callable[[_T], _S], __arg: _T) -> Callable[[], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2], _S], __arg: _T) -> Callable[[_T2], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2, _T3], _S], __arg: _T) -> Callable[[_T2, _T3], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2, _T3, _T4], _S], __arg: _T) -> Callable[[_T2, _T3, _T4], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2, _T3, _T4, _T5], _S], __arg: _T) -> Callable[[_T2, _T3, _T4, _T5], _S]: ...

@overload
def partial(__func: Callable[[_T, _T2], _S],
            __arg1: _T,
            __arg2: _T2) -> Callable[[], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2, _T3], _S],
            __arg1: _T,
            __arg2: _T2) -> Callable[[_T3], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2, _T3, _T4], _S],
            __arg1: _T,
            __arg2: _T2) -> Callable[[_T3, _T4], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2, _T3, _T4, _T5], _S],
            __arg1: _T,
            __arg2: _T2) -> Callable[[_T3, _T4, _T5], _S]: ...

@overload
def partial(__func: Callable[[_T, _T2, _T3], _S],
            __arg1: _T,
            __arg2: _T2,
            __arg3: _T3) -> Callable[[], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2, _T3, _T4], _S],
            __arg1: _T,
            __arg2: _T2,
            __arg3: _T3) -> Callable[[_T4], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2, _T3, _T4, _T5], _S],
            __arg1: _T,
            __arg2: _T2,
            __arg3: _T3) -> Callable[[_T4, _T5], _S]: ...

@overload
def partial(__func: Callable[[_T, _T2, _T3, _T4], _S],
            __arg1: _T,
            __arg2: _T2,
            __arg3: _T3,
            __arg4: _T4) -> Callable[[], _S]: ...
@overload
def partial(__func: Callable[[_T, _T2, _T3, _T4, _T5], _S],
            __arg1: _T,
            __arg2: _T2,
            __arg3: _T3,
            __arg4: _T4) -> Callable[[_T5], _S]: ...

@overload
def partial(__func: Callable[[_T, _T2, _T3, _T4, _T5], _S],
            __arg1: _T,
            __arg2: _T2,
            __arg3: _T3,
            __arg4: _T4,
            __arg5: _T5) -> Callable[[], _S]: ...

@overload
def partial(__func: Callable[..., _S],
            *args: Any,
            **kwargs: Any) -> Callable[..., _S]: ...
