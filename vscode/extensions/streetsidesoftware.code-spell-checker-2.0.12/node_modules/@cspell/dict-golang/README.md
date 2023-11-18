# Cspell Go Language Dictionary

Go Language dictionary for cspell.

This is a pre-built dictionary for use with cspell.

Supports keywords and built-in library names up to Go 1.12.

This dictionary is included by default in cSpell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-golang
cspell link add @cspell/dict-golang
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-golang
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-golang/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Contributors

@AlekSi - Alexey Palazhchenko: https://github.com/AlekSi/go-words

## License

MIT

> Some packages may have other licenses included.
