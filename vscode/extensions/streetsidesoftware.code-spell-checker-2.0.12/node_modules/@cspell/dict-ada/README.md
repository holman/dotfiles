# Cspell Ada Language Dictionary

Ada Language dictionary for cspell.

This is a pre-built dictionary for use with cspell.

Supports Ada keywords.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-ada
cspell link add @cspell/dict-ada
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-ada
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-ada/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Reference

https://www.adaic.org/resources/add_content/standards/05rm/html/RM-2-9.html

## Contributors

@Jason3S - Jason Dent

## License

MIT

> Some packages may have other licenses included.
