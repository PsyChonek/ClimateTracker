'use strict';

var fp = require('fastify-plugin'); // the use of fastify-plugin is required to be able
// to export the decorators to the outer scope


module.exports = fp(function _callee(fastify, opts) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          fastify.decorate('someSupport', function () {
            return 'hugs';
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});