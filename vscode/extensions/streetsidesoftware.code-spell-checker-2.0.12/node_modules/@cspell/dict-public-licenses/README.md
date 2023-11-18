# Cspell Common Public Licenses Dictionary

Common Public Licenses dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-public-licenses
cspell link add @cspell/dict-public-licenses
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-public-licenses
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-public-licenses
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-public-licenses/cspell-ext.json"],
    // …
}
```

# Source

[spdx-license-ids: a list of SPDX license identifiers](https://github.com/jslicense/spdx-license-ids)

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

MIT

> Some packages may have other licenses included.
