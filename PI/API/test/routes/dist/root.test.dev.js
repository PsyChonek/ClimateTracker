'use strict';

var _require = require('tap'),
    test = _require.test;

var _require2 = require('../helper'),
    build = _require2.build;

test('default root route', function _callee(t) {
  var app, res;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(build(t));

        case 2:
          app = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(app.inject({
            url: '/'
          }));

        case 5:
          res = _context.sent;
          t.same(JSON.parse(res.payload), {
            root: true
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}); // inject callback style:
//
// test('default root route', (t) => {
//   t.plan(2)
//   const app = await build(t)
//
//   app.inject({
//     url: '/'
//   }, (err, res) => {
//     t.error(err)
//     t.same(JSON.parse(res.payload), { root: true })
//   })
// })