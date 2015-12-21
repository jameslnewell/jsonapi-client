'use strict';

const qs = require('qs');
const invariant = require('invariant');
const continueStream = require('continue-stream');
const streamify = require('stream-array');

/**
 * Resource for a JSON API
 * @class
 * @param {Object} config
 * @param {Object} config.schema
 * @param {Client} config.client
 * @param {string} config.url
 */
class Resource {

  constructor(config) {

    this.schema = config.schema;
    this.client = config.client;

    this.url = {
      one: config.url.fetch ? config.url.fetch : `${config.url}/\${id}`,
      all: config.url.fetchAll ? config.url.fetchAll : `${config.url}`,
      create: config.url.create ? config.url.create : `${config.url}`,
      update: config.url.update ? config.url.update: `${config.url}/\${id}`,
      delete: config.url.delete ? config.url.delete: `${config.url}/\${id}`
    };

  }

  /**
   * Fetch a resource
   * @returns {Promise}
   */
  one(id, criteria) {
    invariant(id, 'An ID is required');
    const path = this.url.one.replace('${id}', id)+'?'+qs.stringify(criteria || {});
    return this.client.fetch(path);
  }

  //TODO: need many?

  /**
   * Fetch all the resources from multiple pages
   * @returns {Stream}
   */
  all(criteria) {
    let path = this.url.all+'?'+qs.stringify(criteria || {});
    return continueStream.obj(callback => {
      this.client.fetch(path).then(
        resources => {
          if (resources.next) {
            path = resources.next;
            callback(null, streamify(resources));
          } else {
            callback();
          }
        },
        error => callback(error)
      );
    });
  }

  /**
   * Create a new resource
   * @param   {Object} resource
   * @returns {Promise}
   */
  create(resource) {
    const path = this.url.create.replace('${id}', resource.id);
    return this.client.create(path, this.schema, resource);
  }

  /**
   * Update an existing resource
   * @param   {Object} resource
   * @returns {Promise}
   */
  update(resource) {
    const path = this.url.update.replace('${id}', resource.id);
    return this.client.update(path, this.schema, resource);
  }

  /**
   * Delete an existing resource
   * @param   {string} id
   * @returns {Promise}
   */
  delete(id) {
    const path = this.url.delete.replace('${id}', id);
    return this.client.delete(path, id);
  }

}

/**
 * @namespace {object} JSONAPI
 */
module.exports = Resource;
