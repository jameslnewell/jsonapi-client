const Client = require('../lib/client');

const AUTHOR_SCHEMA = {
  type: 'author',
  relationships: {
    books: 'book'
  }
};

const BOOK_SCHEMA = {
  type: 'books',
  relationships: {
    author: 'author'
  }
};

const client = new Client({
  baseUrl: 'http://localhost:8080/v1'
});

//client.fetch('/books/1?include=author')
//  .then(book => ({title: book.title, author: book.author.name}))
//  .then(book => console.log(book))
//  .catch(err => console.log(err))
//;
//
//client.fetch('/books?include=author')
//  .then(books => books.map(book => ({title: book.title, author: book.author.name})))
//  .then(books => console.log(books))
//  .catch(err => console.log(err))
//;

//client.create('/authors', AUTHOR_SCHEMA, {
//  name: 'James Newell',
//  date_of_birth: '2010-12-12'
//})
//  .then(book => console.log(book))
//  .catch(err => console.log(err))
//;

//client.create('/books', BOOK_SCHEMA, {
//  title: 'The Holy Bible',
//  author: {id: 3}
//})
//  .then(book => console.log(book))
//  .catch(err => console.log(err))
//;

function fetchAuthor() {
  return client.fetch('/authors/3')
    .then(author => console.log('fetch', author))
  ;
}

function updateAuthor() {
  return client.update('/authors/3', AUTHOR_SCHEMA, {
      id: 3,
      name: 'John Smith'
    })
    .then(author => console.log('update', author))
  ;
}

function deleteAuthor() {
  return client.delete('/authors/3')
    .then(() => console.log('delete'))
  ;
}



fetchAuthor()
  .then(updateAuthor)
  .then(fetchAuthor)
  .then(deleteAuthor)
  .then(fetchAuthor)
  .catch(err => console.log(err))
;
