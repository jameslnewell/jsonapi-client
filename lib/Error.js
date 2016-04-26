'use strict';

class JSONAPIError extends Error {

  constructor(msg, options) {
    super(msg);
    this.res = options && options.res;
    this.prev = options && options.prev;
  }

}

module.exports = JSONAPIError;