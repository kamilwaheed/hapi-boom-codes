/*
 * hapi-response-errors
 *
 * Copyright (c) 2015 Kamil Waheed
 * Licensed under the MIT license.
 */

'use strict';

// Declare internals
var internals = {};

// Defaults
internals.defaults = {};

exports.register = function(server, options, next) {

  /**
   * Check to see if the `data.code` property is defined on the response error object.
   * Make it a part of the output payload object if so.
   */
  
  server.ext('onPreResponse', function(request, reply) {
    var response = request.response;

    // istanbul ignore next
    if (!response.isBoom) {
      return reply.continue();
    }

    var error = response;

    // istanbul ignore next
    if (error.data && error.data.code) {
      error.output.payload.code = error.data.code;
    }

    return reply(error);
  });

  next();
};

module.exports.register.attributes = {
  pkg: require('../package.json')
};