const assert = require('assert');
const Query = require('../lib/query');

describe('query', () => {

  it('should filter resource by where', () => {

    const builder = new Query();
    const query = builder
      .where('first_name', 'John')
      .where('gender', 'M')
      .toString(false)
    ;

    assert.equal(query, `where[first_name]=John&where[gender]=M`);

  });

  it('should include resource', () => {

    const builder = new Query();
    const query = builder
      .include('emails')
      .include('addresses')
      .toString(false)
    ;

    assert.equal(query, `include=emails,addresses`);

  });

});