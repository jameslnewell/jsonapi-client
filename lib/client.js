'use strict';

const http = require('go-fetch');
const prefixUrl = require('go-fetch-prefix-url');
const contentType = require('go-fetch-content-type');
const parseBody = require('go-fetch-parse-body');

const serialize = require('./serialize');
const unserialize = require('./unserialize');

/** @module JSONAPI */

const DEFAULT_CONTENT_TYPE = 'application/vnd.api+json';

/**
 * Client for a JSON API
 * @class
 */
class Client {

  /**
   * Construct the client
   * @param {object}    config
   * @param {string}    [config.baseUrl]
   * @param {string}    [config.contentType]
   * @param {function}  [config.authorise]
   */
  constructor(config) {

    this._contentType = config.contentType || DEFAULT_CONTENT_TYPE;

    this._http = http();

    if (config.baseUrl) {
      this._http.use(prefixUrl(config.baseUrl));
    }

    this._http
      .use(contentType)
      .use(parseBody())
      .use(parseBody.json({types: [
        this._contentType
      ]}))
    ;

    if (config.authorise) {
      config.authorise(this._http);
    }

  }

  /**
   * Fetch a resource
   * @param   {string} path
   * @returns {Promise}
   */
  fetch(path) {
    return new Promise((resolve, reject) => {
      this._http.get(path, (err, res) => {

        //notify the user of errors
        if (err) {
          return reject(err);
        }

        //notify the user of API errors
        if (!res.isContentType(this._contentType)) {
          return reject(new Error(`The server sent an invalid content type (${res.getContentType()}).`));
        }

        //unserialize the resource(s)
        let resource;
        try {
          resource = unserialize(res.getBody());
        } catch(err) {
          return reject(err);
        }

        return resolve(resource);
      });
    });
  }

  /**
   * Create a new resource
   * @param   {string} path
   * @param   {Object} schema
   * @param   {Object} resource
   * @returns {Promise}
   */
  create(path, schema, resource) {
    return new Promise((resolve, reject) => {

      //serialize the resource
      let body;
      try {
        body = serialize(schema, resource);
      } catch(err) {
        return reject(err);
      }

      this._http.post(path, {'content-type': this._contentType}, JSON.stringify(body), (err, res) => {

        //notify the user of errors
        if (err) {
          return reject(err);
        }

        //notify the user of API errors
        if (!res.isContentType(this._contentType)) {
          return reject(new Error(`The server sent an invalid content type (${res.getContentType()}).`));
        }

        //unserialize the resource
        let resource;
        try {
          resource = unserialize(res.getBody());
        } catch(err) {
          return reject(err);
        }

        return resolve(resource);
      });
    });
  }

  /**
   * Update an existing resource
   * @param   {string} path
   * @param   {Object} schema
   * @param   {Object} resource
   * @returns {Promise}
   */
  update(path, schema, resource) {
    return new Promise((resolve, reject) => {

      //serialize the resource
      let body;
      try {
        body = serialize(schema, resource);
      } catch(err) {
        return reject(err);
      }

      this._http.request('patch', path, {'content-type': this._contentType}, JSON.stringify(body), (err, res) => {

        //notify the user of errors
        if (err) {
          return reject(err);
        }

        //notify the user of API errors
        if (!res.isContentType(this._contentType)) {
          return reject(new Error(`The server sent an invalid content type (${res.getContentType()}).`));
        }

        //unserialize the resource
        let resource;
        try {
          resource = unserialize(res.getBody());
        } catch(err) {
          return reject(err);
        }

        return resolve(resource);
      });
    });
  }

  /**
   * Delete an existing resource
   * @param   {string} path
   * @returns {Promise}
   */
  delete(path) {
    return new Promise((resolve, reject) => {
      this._http.delete(path, (err, res) => {

        //notify the user of errors
        if (err) {
          return reject(err);
        }

        //notify the user of API errors
        if ([200, 202, 204].indexOf(res.getStatus()) === -1) {
          return reject(new Error('Response was not valid.'));
        }

        resolve(null);
      });
    });
  }

}

/** @namespace {object} JSONAPI */
module.exports = Client;
