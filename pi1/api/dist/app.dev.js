'use strict';

var path = require('node:path');

var AutoLoad = require('@fastify/autoload'); // Pass --options via CLI arguments in command to enable these options.


var options = {};

module.exports = function _callee(fastify, opts) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Place here your custom code!
          // Do not touch the following lines
          // This loads all plugins defined in plugins
          // those should be support plugins that are reused
          // through your application
          fastify.register(AutoLoad, {
            dir: path.join(__dirname, 'plugins'),
            options: Object.assign({}, opts)
          }); // This loads all plugins defined in routes
          // define your routes in one of these

          fastify.register(AutoLoad, {
            dir: path.join(__dirname, 'routes'),
            options: Object.assign({}, opts)
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.options = options;