# Cspell TypeScript and JavaScript Dictionary

TypeScript and JavaScript dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-typescript
cspell link add @cspell/dict-typescript
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-typescript
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-typescript/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## License

MIT

> Some packages may have other licenses included.
