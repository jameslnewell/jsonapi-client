'use strict';

const invariant = require('invariant');
const qs = require('qs');
const streamify = require('stream-array');
const continueStream = require('continue-stream');

const Error = require('./Error');
const serialize = require('./serialize');
const unserialize = require('./unserialize');

function assertResponseIsJSON(res) {
  if (!res.isJSON()) {
    throw new Error(`The JSON:API response contains an invalid content type ${res.headers['content-type']}.`, {res});
  }
}

function assertResponseIsFound(res) {
  if (res.status === 404) {
    throw new Error(`The JSON:API resource was not found.`, {res});
  }
}

/**
 * A collection of JSON:API resources
 * @class
 */
class Collection {

  /**
   * Construct a collection of JSON:API resources
   * @param {Object} options
   * @param {Object} options.http
   * @param {Client} options.type
   * @param {string} [options.url]
   * @param {string} [options.relationships]
   */
  constructor(options) {

    this.http = options.http;
    this.type = options.type;
    this.relationships = options.relationships || {};

    const url = options.url || options.type;
    this.url = {
      one: url.fetch ? url.fetch : `${url}/\${id}`,
      all: url.fetchAll ? url.fetchAll : `${url}`,
      create: url.create ? url.create : `${url}`,
      update: url.update ? url.update: `${url}/\${id}`,
      delete: url.delete ? url.delete: `${url}/\${id}`
    };

  }

  /**
   * Get resource(s) from the collection
   * @private
   * @param   {string} path
   * @returns {Promise}
   */
  fetch(path) {
    return this.http.get(path)
      .then(res => {

        //notify the user of API errors
        assertResponseIsFound(res);
        assertResponseIsJSON(res);

        return res.json();
      })
      .then(json => unserialize(json))
    ;
  }

  /**
   * Get a single resource from the collection
   * @param   {string} id
   * @param   {object} criteria
   * @returns {Promise}
   */
  one(id, criteria) {
    invariant(id, 'A JSON:API resource ID is required');
    const path = this.url.one.replace('${id}', id)+'?'+qs.stringify(criteria || {});
    return this.fetch(path);
  }

  /**
   * Get a single page of resources from the collection
   * @returns {Stream}
   */
  many(criteria) {
    let path = this.url.all+'?'+qs.stringify(criteria || {});
    return this.fetch(path);
  }

  /**
   * Fetch all the resources from multiple pages
   * @returns {Stream}
   */
  all(criteria) {
    let nextUrl = this.url.all+'?'+qs.stringify(criteria || {});
    return continueStream.obj(callback => {

      //if there's no next URL then don't try to fetch more
      if (!nextUrl) {
        return callback(null, null);
      }

      //fetch the next URL
      this.fetch(nextUrl)
        .then(resources => {

          nextUrl = resources.next;

          //if there's no resources returned then don't try to fetch more
          if (resources.length === 0) {
            return callback(null);
          }

          //return the resources and try fetching from the next URL
          callback(null, streamify(resources));

        })
        .catch(error => callback(error, null))
      ;

    });
  }

  /**
   * Create a new resource
   * @param   {Object} resource
   * @returns {Promise}
   */
  create(resource) {

    //serialize the resource
    let body;
    try {
      body = serialize(
        {
          type: this.type,
          relationships: this.relationships
        },
        resource
      );
    } catch(err) {
      return Promise.reject(err);
    }

    const path = this.url.create.replace('${id}', resource.id);
    return this.http.post(path, body)
      .then(res => {

        //notify the user of API errors
        assertResponseIsFound(res);
        assertResponseIsJSON(res);

        return res.json();
      })
      .then(json => unserialize(json))
    ;

  }

  /**
   * Update an existing resource
   * @param   {Object} resource
   * @returns {Promise}
   */
  update(resource) {

    //serialize the resource
    let body;
    try {
      body = serialize(
        {
          type: this.type,
          relationships: this.relationships
        },
        resource
      );
    } catch(err) {
      return Promise.reject(err);
    }

    const path = this.url.update.replace('${id}', resource.id);
    return this.http.request('patch', path, {}, body)
      .then(res => {

        //notify the user of API errors
        assertResponseIsFound(res);
        assertResponseIsJSON(res);

        return res.json();
      })
      .then(json => unserialize(json))
    ;

  }

  /**
   * Delete an existing resource
   * @param   {string} id
   * @returns {Promise}
   */
  delete(id) {
    const path = this.url.delete.replace('${id}', id);
    return this.http.delete(path)
      .then(res => {

        assertResponseIsFound(res);

        //notify the user of API errors
        if ([200, 202, 204].indexOf(res.status) === -1) {
          throw new Error(`The server sent an invalid response.`, {res});
        }

      })
      ;

  }

}

/**
 * @namespace {object} JSONAPI
 */
module.exports = Collection;
