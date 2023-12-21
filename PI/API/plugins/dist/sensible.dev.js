'use strict';

var fp = require('fastify-plugin');
/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */


module.exports = fp(function _callee(fastify, opts) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          fastify.register(require('@fastify/sensible'), {
            errorHandler: false
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});