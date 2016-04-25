'use strict';

const HttpClient = require('go-fetch');
const fetchPrefix = require('go-fetch-prefix-url');
const fetchJson = require('go-fetch-json');
const JSONAPI = require('..');

//configure a HTTP client
const fetch = new HttpClient()
  .use(fetchPrefix('http://localhost:16006/rest'))
  .use(fetchJson())
;

fetch.before((res, next) => {
  console.log(res.toString());
  next(null, res);
});

fetch.after((res, next) => {
  console.log(res.toString());
  next(null, res);
});

//create a JSON:API collection
const collection = new JSONAPI({
  http: fetch,
  type: 'photos',
  relationships: {
    author: 'person',
    articles: 'article'
  }
});

//get a single resource from the collection
collection.one('aab14844-97e7-401c-98c8-0bd5ec922d93')
  .then(json => console.log(json))
  .catch(err => console.error(err))
;

//get a single page of resources from the collection
collection.many()
  .then(json => console.log(json))
  .catch(err => console.error(err))
;

//get all of the resources from the collection
collection.all()
  .on('data', json => console.log(json))
  .on('error', err => console.error(err))
;

//create a new resource in the collection
collection.create({
    title: 'Bacon for breakfast!',
    url: 'http://www.example.com/bacon-breakfast.jpg'
  })
  .then(json => console.log(json))
  .catch(err => console.error(err))
;

//update an existing resource in the collection
collection.update({
  id: 'aab14844-97e7-401c-98c8-0bd5ec922d93',
  title: 'Bacon *and* eggs for breakfast!'
})
  .then(json => console.log(json))
  .catch(err => console.error(err))
;

//delete an existing resource from the collection
collection.delete('aab14844-97e7-401c-98c8-0bd5ec922d93')
  .then(json => console.log(json))
  .catch(err => console.error(err))
;
