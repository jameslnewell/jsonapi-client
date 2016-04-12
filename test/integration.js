//'use strict';
//
//const expect = require('chai').expect;
//
//const Client = require('../lib/Client');
//const Resource = require('../lib/resource');
//
//const BOOK_SCHEMA = {
//  type: 'books',
//  relationships: {
//    author: 'author'
//  }
//};
//
//const client = new Client({
//  baseUrl: 'http://localhost:8080/v1/'
//});
//
//const resource = new Resource({
//  client: client,
//  schema: BOOK_SCHEMA,
//  url: '/books'
//});
//
//describe('integration', () => {
//  //
//  //it('should fetch authors', () => {
//  //
//  //  const resource = new Resource({
//  //    type: 'authors',
//  //    relationships: {},
//  //    endpoints: {
//  //      get: 'http://localhost:8080/v1/authors'
//  //    }
//  //  });
//  //
//  //  return resource.fetch()
//  //    .then(data => {
//  //      console.log(data);
//  //    })
//  //  ;
//  //
//  //});
//
//  it.only('should fetch some books with the author included', () => {
//
//    const resource = new Resource({
//      url: '/books',
//      client: client,
//      schema: BOOK_SCHEMA
//    });
//
//    return resource.list()
//      .then(books => {
//        expect(books.length).to.be.at.least(0);
//        books.forEach(book => {
//          expect(book).to.have.property('id');
//          expect(book).to.have.property('title');
//          expect(book).to.have.property('author').to.have.property('id');
//        });
//      })
//    ;
//
//  });
//
//});
