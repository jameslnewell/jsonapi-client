'use strict';
const Qs = require('qs');
const unserialize = require('./unserialize');

class Query {

  constructor() {
    this._fields = [];
    this._where = {};
    this._includes = [];
  }

  /**
   * Limit results to a specific field
   * @param   {string} field
   * @returns {Query}
   */
  select(field) {
    this._fields.push(field);
    return this;
  }

  /**
   * Query a specific field
   * @param   {string} field
   * @param   {string} value
   * @returns {Query}
   */
  where(field, value) {
    this._where[field] = value;
    return this;
  }

  sort(field, direction) {
    return this;
  }

  /**
   * Include a resource
   * @param   {string} resource
   * @returns {Query}
   */
  include(resource) {
    this._includes.push(resource);
    return this;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.config.endpoints.get, (err, res) => {
        if (err) return reject(err);

        let object;
        try {
          object = unserialize(res.getBody());
        } catch(err) {
          reject(err);
        }

        return resolve(object);
      });
    });
  }

  then(onResolved, onRejected) {
    return this.fetch().then(onResolved, onRejected);
  }

  catch(onRejected) {
    return this.fetch().catch(onRejected);
  }

  /**
   * Encode the query as a string
   * @param   {boolean} encode
   * @returns {string}
   */
  toString(encode) {
    const query = {};

    encode = typeof encode === 'undefined' ? true : false;

    if (Object.keys(this._where).length) {
      query.where = this._where;
    }

    if (this._includes.length) {
      query.include = this._includes.join(',');
    }

    return Qs.stringify(query, {encode});
  }

}

module.exports = Query;
