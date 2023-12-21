'use strict'; // This file contains code that we reuse
// between our tests.

var _require = require('fastify-cli/helper'),
    buildApplication = _require.build;

var path = require('node:path');

var AppPath = path.join(__dirname, '..', 'app.js'); // Fill in this config with all the configurations
// needed for testing the application

function config() {
  return {};
} // automatically build and tear down our instance


function build(t) {
  var argv, app;
  return regeneratorRuntime.async(function build$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // you can set all the options supported by the fastify CLI command
          argv = [AppPath]; // fastify-plugin ensures that all decorators
          // are exposed for testing purposes, this is
          // different from the production setup

          _context.next = 3;
          return regeneratorRuntime.awrap(buildApplication(argv, config()));

        case 3:
          app = _context.sent;
          // tear down our app after we are done
          t.teardown(app.close.bind(app));
          return _context.abrupt("return", app);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  config: config,
  build: build
};