# Stub for tabulate: https://bitbucket.org/astanin/python-tabulate
from typing import Any, Dict, Iterable, Sequence, Union


def __getattr__(name: str) -> Any: ...

def tabulate(
    tabular_data: Iterable[Iterable[Any]],
    headers: Union[str, Dict[str, str], Sequence[str]] = ...,
    tablefmt: str = ...,
    floatfmt: str = ...,
    numalign: str = ...,
    stralign: str = ...,
    missingval: str = ...,
    showindex: str = ...,
    disable_numparse: bool = ...
) -> str:
    ...
