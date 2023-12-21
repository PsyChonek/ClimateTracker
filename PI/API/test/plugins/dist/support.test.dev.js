'use strict';

var _require = require('tap'),
    test = _require.test;

var Fastify = require('fastify');

var Support = require('../../plugins/support');

test('support works standalone', function _callee(t) {
  var fastify;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          fastify = Fastify();
          fastify.register(Support);
          _context.next = 4;
          return regeneratorRuntime.awrap(fastify.ready());

        case 4:
          t.equal(fastify.someSupport(), 'hugs');

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}); // You can also use plugin with opts in fastify v2
//
// test('support works standalone', (t) => {
//   t.plan(2)
//   const fastify = Fastify()
//   fastify.register(Support)
//
//   fastify.ready((err) => {
//     t.error(err)
//     t.equal(fastify.someSupport(), 'hugs')
//   })
// })