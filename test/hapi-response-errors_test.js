'use strict';

var hapi = require('hapi')
  , should = require('should')
  , Boom = require('boom')
  , plugin = require('../');

describe('hapi-response-errors', function() {

  var server;
  var errorCodes = { InvalidEmail: 'InvalidEmail' };

  // prepare test environment
  before(function () {
    server = new hapi.Server();
    server.connection({port: 3000});
    server.route({
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        return reply(
          Boom.badRequest('The email address doesn\'t look good.', { code: errorCodes.InvalidEmail })
        );
      }
    });
  });

  // destroy test environment
  after(function(done) {
    server.stop(function() {
      done();
    });
  });

  it('loads successfully', function(done) {
    server.register(plugin, function(err) {

      (err === undefined || err === null).should.be.true;

      server.start(function(err) {
        if (err) {
          throw err;
        }

        done();
      });

    });
  });

  it('should include the `code` field in the response', function(done) {
    server.inject('/', function(res) {
      var result = res.result;

      result.should.have.property('statusCode');
      result.statusCode.should.equal(400);

      result.should.have.property('error');
      result.error.should.equal('Bad Request');

      result.should.have.property('code');
      result.code.should.equal(errorCodes.InvalidEmail);

      done();
    });
  });

  describe('multiple onPreResponse handlers', function () {
    var calls = 0;

    // add a second onPreResponse handler
    before(function (done) {
      var testPlugin = {
        register: function (server, options, next) {
          server.ext('onPreResponse', function(request, reply) {
            calls += 1;
            return reply.continue();
          });

          return next();
        }
      };
      testPlugin.register.attributes = { name: 'test' };

      server.register(testPlugin, function (err) {
        if (err) {
          throw err;
        }

        done();
      })
    });

    it('should call the second plugin', function (done) {
      server.inject('/', function(res) {
        calls.should.equal(1);

        done();
      });
    });
  });
});
