# Cspell Rust Dictionary

Rust dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-rust
cspell link add @cspell/dict-rust
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-rust
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-rust/cspell-ext.json"],
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

Keywords are taken from the repository

[https://github.com/rust-lang/gedit-config](https://github.com/rust-lang/gedit-config)
