const Client = require('../lib/Client');
const Resource = require('../lib/resource');

const BOOK_SCHEMA = {
  type: 'books',
  relationships: {
    author: 'author'
  }
};

const client = new Client({
  baseUrl: 'http://localhost:8080/v1'
});

const resource = new Resource({
  client: client,
  schema: BOOK_SCHEMA,
  url: '/books'
});

//resource.create({
//  title: 'The life and achievements of James',
//  author: {id: 2},
//  date_published: '2040-10-02'
//})
//  .then(book => console.log(book))
//  .catch(err => console.error(err))
//;

//resource.update({
//    id: 12,
//    title: 'The life and achievements of James Newell',
//  })
//  .then(book => console.log(book))
//  .catch(err => console.error(err))
//;

resource.delete(12)
  .then(book => console.log(book))
  .catch(err => console.error(err))
;