'use strict';

const unserialize = require('./unserialize');
//add .next, .prev, .last, .first to returned arrays


module.exports = class Query {

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  field(field) {
    this._fields = this._fields.concat(field);
    return this;
  }

  sort(field, direction) {
    return this;
  }

  filter(name, value) {
    return this;
  }

  include(resource) {
    this._includes = this._includes.concat(resource);
    return this;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      this.httpClient.get('url', (err, res) => {
        if (err) return reject(err);

        unserialize(res);

        return resolve(res);
      });
    });
  }

  then(onResolved, onRejected) {
    return this.fetch().then(onResolved, onRejected);
  }

  catch(onRejected) {
    return this.fetch().catch(onRejected);
  }

};
