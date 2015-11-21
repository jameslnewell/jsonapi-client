'use strict';

const HttpClient = require('go-fetch');
const Query = require('./query');
const serialize = require('./serialize');

function createDefaultHttpClient() {

}

/**
 * Client for a JSON API
 */
class Client {

  /**
   * Construct the client
   * @param {object} schema
   */
  constructor(schema) {
    this.schema = schema;
    this.client = new HttpClient({});
  }

  /**
   * Fetch a resource
   * @returns {Object}
   */
  fetch() {
    return new Query(this.client);
  }

  /**
   * Create a new resource
   * @param   {object} resource
   * @returns {Promise}
   */
  create(resource) {
    return new Promise((resolve, reject) => {
      this.client.post(this.schema.url, {}, serialize(this.schema, resource), (err, res) => {
        if (err) return reject(err);
        resolve(resource);
      });
    });
  }

  /**
   * Update an existing resource
   * @param   {object} resource
   * @returns {Promise}
   */
  update(resource) {
    return new Promise((resolve, reject) => {
      this.client.put(this.schema.url, {}, serialize(this.schema, resource), (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  /**
   * Delete an existing resource
   * @param   {string} id
   * @returns {Promise}
   */
  delete(id) {
    return new Promise((resolve, reject) => {
      this.client.delete(this.schema.url, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

}

module.exports = Client;
