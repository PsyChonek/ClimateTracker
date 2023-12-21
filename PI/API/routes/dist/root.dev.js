'use strict';

module.exports = function _callee2(fastify, opts) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          fastify.get('/', function _callee(request, reply) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", {
                      root: true
                    });

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};