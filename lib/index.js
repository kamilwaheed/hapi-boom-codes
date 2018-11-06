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

const register = function(server) {

  /**
   * Check to see if the `data.code` property is defined on the response error object.
   * Make it a part of the output payload object if so.
   */

  server.ext('onPreResponse', function(request, h) {
    var response = request.response;
    // istanbul ignore next
    if (!response.isBoom) {
      return h.continue;
    }

    var error = response;
    // istanbul ignore next
    if (error.data && error.data.code) {
      error.output.payload.code = error.data.code;
    }
    return h.continue;
  });
};

exports.plugin = {
  pkg: require("../package.json"),
  name: "hapi-boom-codes",
  register
};