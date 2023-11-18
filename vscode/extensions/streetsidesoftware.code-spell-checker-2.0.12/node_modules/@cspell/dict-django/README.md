# Cspell Django Dictionary

Django dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-django
cspell link add @cspell/dict-django
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-django
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-django/cspell-ext.json"],
    // …
}
```

## Updating

This dictionary is generated from django's official documentation index : https://docs.djangoproject.com/en/`VERSION`/genindex/.
To update it, edit `update.py`to match wanted django's `VERSION`, install requirements ([requests](http://docs.python-requests.org) and [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)) and run the script :

```sh
pip install -r requirements.txt
python update.py
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## License

WTFPL
