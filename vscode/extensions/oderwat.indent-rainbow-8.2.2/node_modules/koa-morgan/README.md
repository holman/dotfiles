# koa-morgan

> HTTP request logger middleware for koa.  
> [morgan] wrapper for koa's middleware.

[![NPM version][npm-img]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![Dependency status][david-img]][david-url]
[![License][license-img]][license-url]

## Install

```sh
$ npm install --save koa-morgan
```

## Usage

### **=1.x**, 100%, working with **morgan** and **koa-v2**

```js
const fs = require('fs')
const Koa = require('koa')
const morgan = require('koa-morgan')

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(__dirname + '/access.log',
                                             { flags: 'a' })
const app = new Koa()

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.use((ctx) => {
  ctx.body = 'hello, world!'
})

app.listen(2333)
```

### **=0.x**, working with **koa-v1**

```js
var koa = require('koa');
var morgan = require('koa-morgan');
var app = koa();

app.use(morgan.middleware(format, options));

```

[npm-img]: https://img.shields.io/npm/v/koa-morgan.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-morgan
[travis-img]: https://img.shields.io/travis/koa-modules/morgan.svg?style=flat-square
[travis-url]: https://travis-ci.org/koa-modules/morgan
[coveralls-img]: https://img.shields.io/coveralls/koa-modules/morgan.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koa-modules/morgan?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/koa-modules/morgan.svg?style=flat-square
[david-url]: https://david-dm.org/koa-modules/morgan
[downloads-image]: https://img.shields.io/npm/dm/koa-morgan.svg?style=flat-square
[morgan]: https://github.com/expressjs/morgan
