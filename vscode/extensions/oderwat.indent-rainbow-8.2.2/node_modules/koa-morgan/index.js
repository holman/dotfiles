'use strict'

/*!
 * morgan
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014 Douglas Christopher Wilson
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const originalMorgan = require('morgan')

/**
 * Expose `morgan`.
 */

module.exports = morgan

morgan.compile = originalMorgan.compile
morgan.format = originalMorgan.format
morgan.token = originalMorgan.token

function morgan(format, options) {
  const fn = originalMorgan(format, options)
  return (ctx, next) => {
    return new Promise((resolve, reject) => {
      fn(ctx.req, ctx.res, (err) => {
        err ? reject(err) : resolve(ctx)
      })
    }).then(next)
  }
}
