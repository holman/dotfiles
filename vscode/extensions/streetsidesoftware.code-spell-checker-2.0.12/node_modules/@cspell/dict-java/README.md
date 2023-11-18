# Cspell Java Dictionary

Java dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-java
cspell link add @cspell/dict-java
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-java
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-java/cspell-ext.json"],
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

## Contributors

- [Arthur Peters](https://github.com/arthurp) contributed the word list: [Gist](https://gist.github.com/arthurp/91963552130d42a11cf7dc1ad1967c5b)
- [Benjamin Schmid](https://twitter.com/bentolor) updated wordlist for
  JDK 12 via
  [a new script](https://github.com/bentolor/jdk9-module-enumerator)
  leveraging the [classgraph project](https://github.com/classgraph/classgraph)
