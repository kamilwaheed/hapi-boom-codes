/* eslint-env es6 */
'use strict';

var hapi = require('hapi'),
  Boom = require('boom'),
  plugin = require('../'),
  should = require('should');

describe('hapi-response-errors', function () {

  var server;
  var errorCodes = { InvalidEmail: 'InvalidEmail' };

  // prepare test environment
  before(function () {
    server = new hapi.Server({ port: 3000 });
    server.route({
      method: 'GET',
      path: '/',
      handler: () => {
        return Boom.badRequest('The email address doesn\'t look good.', { code: errorCodes.InvalidEmail });
      }
    });
  });

  // destroy test environment
  after(async () => {
    await server.stop();
  });

  it('loads successfully', async () => {
    await server.register({ plugin });
    await server.start();
  });

  it('should include the `code` field in the response', async () => {
    const res = await server.inject('/');
    var result = res.result;
    result.should.have.property('statusCode');
    result.statusCode.should.equal(400);

    result.should.have.property('error');
    result.error.should.equal('Bad Request');

    result.should.have.property('code');
    result.code.should.equal(errorCodes.InvalidEmail);
  });

  describe('multiple onPreResponse handlers', function () {
    var calls = 0;

    // add a second onPreResponse handler
    before(async () => {
      var testPlugin = {
        register: function (server) {
          server.ext('onPreResponse', function (request, h) {
            calls += 1;
            return h.continue;
          });
        }
      };
      testPlugin.name = 'test';

      await server.register(testPlugin);
    });

    it('should call the second plugin', async () => {
      await server.inject('/');
      calls.should.equal(1);
    });
  });
});
