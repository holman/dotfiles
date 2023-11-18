# Cspell Bundled Dictionaries

This package contains all the dictionaries bundled with cspell.

It has been pull into its own package to make it easier to Webpack cspell.

## Webpack

Example `webpack.config.js` modification:

```js
  externals: [
    /^@cspell\/cspell-bundled-dicts/,
  ],
```

Example: `package.json`:

```js
  "devDependencies": {
    "cspell": "^5",
  },
  "dependencies": {
    "@cspell/cspell-bundled-dicts": "^5"
  }
```

See [streetsidesoftware/cspell-action](https://github.com/streetsidesoftware/cspell-action)
