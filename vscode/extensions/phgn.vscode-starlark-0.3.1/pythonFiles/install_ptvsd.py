import io
import json
import os
import urllib.request as url_lib
import zipfile


EXTENSION_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEBUGGER_DEST = os.path.join(EXTENSION_ROOT, "pythonFiles", "lib", "python")
DEBUGGER_PACKAGE = "ptvsd"
DEBUGGER_VERSION = "5.0.0a5"
DEBUGGER_PYTHON_VERSIONS = ("cp37",)


def _contains(s, parts=()):
    return any(p for p in parts if p in s)


def _get_debugger_wheel_urls():
    json_uri = "https://pypi.org/pypi/{0}/json".format(DEBUGGER_PACKAGE)
    # Response format: https://warehouse.readthedocs.io/api-reference/json/#project
    # Release metadata format: https://github.com/pypa/interoperability-peps/blob/master/pep-0426-core-metadata.rst
    with url_lib.urlopen(json_uri) as response:
        json_response = json.loads(response.read())
        return list(
            r["url"]
            for r in json_response["releases"][DEBUGGER_VERSION]
            if _contains(r["url"], DEBUGGER_PYTHON_VERSIONS)
        )


def _download_and_extract(root, url):
    root = os.getcwd() if root is None or root == "." else root
    prefix = os.path.join("ptvsd-{0}.data".format(DEBUGGER_VERSION), "purelib")
    with url_lib.urlopen(url) as response:
        # Extract only the contents of the purelib subfolder (parent folder of ptvsd),
        # since ptvsd files rely on the presence of a 'ptvsd' folder.
        with zipfile.ZipFile(io.BytesIO(response.read()), "r") as wheel:
            for zip_info in wheel.infolist():
                # Ignore dist info since we are merging multiple wheels
                if ".dist-info" in zip_info.filename:
                    continue
                # Normalize path for Windows, the wheel folder structure
                # uses forward slashes.
                normalized = os.path.normpath(zip_info.filename)
                # Flatten the folder structure.
                zip_info.filename = normalized.split(prefix)[-1]
                wheel.extract(zip_info, root)


def main(root):
    for url in _get_debugger_wheel_urls():
        _download_and_extract(root, url)


if __name__ == "__main__":
    main(DEBUGGER_DEST)
