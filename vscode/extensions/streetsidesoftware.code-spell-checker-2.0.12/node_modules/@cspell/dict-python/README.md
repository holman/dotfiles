# Cspell Python Dictionary

Python dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-python
cspell link add @cspell/dict-python
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-python
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-python/cspell-ext.json"],
    // …
}
```

## Requirements

Requires `cspell >= 5.5.0`

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## License

MIT

> Some packages may have other licenses included.
