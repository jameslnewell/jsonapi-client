'use strict';

const HttpClient = require('go-fetch');
const json = require('go-fetch-json');
const Collection = require('../../lib/Collection');

describe('Collection', () => {

  describe('one()', () => {

    it('should error with a 404', () => {

      const http = new HttpClient()
        .use(json())
        .before((req, next) => next(null, new HttpClient.Response({
          status: 404
        })))
      ;

      const col = new Collection({
        http,
        type: 'people'
      });

      return expect(col.one('abc-123')).to.be.rejectedWith(/not found/);
    });

    it('should error with an invalid content type', () => {

      const http = new HttpClient()
        .use(json())
        .before((req, next) => next(null, new HttpClient.Response({
          status: 200,
          headers: {
            'content-type': 'text/html',
            'content-length': 0
          }
        })))
      ;

      const col = new Collection({
        http,
        type: 'people'
      });

      return expect(col.one('abc-123')).to.be.rejectedWith(/invalid content type/);
    });

  });

});