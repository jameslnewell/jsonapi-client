'use strict';

const expect = require('chai').expect;
const serialize = require('../lib/serialize');

const FIXTURE_PERSON_SCHEMA = {
  type: 'Person',
  relationships: {
    email: 'Email',
    emails: 'Email',
    phone: 'Phone',
    phones: 'Phone'
  }
};

describe('serialize()', () => {

  it('should have a type', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {});

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.type).to.be.equal(FIXTURE_PERSON_SCHEMA.type);

  });

  it('should not have an ID', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {});

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.id).to.not.exist;

  });

  it('should have an ID', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      id: 12
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.id).to.be.equal(12);

  });

  it('should not have any attributes', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {});

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.attributes).to.not.exist;

  });

  it('should have an attribute', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      firstName: 'John'
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.attributes).to.exist;
    expect(json.data.attributes.firstName).to.be.equal('John');

  });

  it('should have multiple attributes', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      firstName: 'John',
      lastName: 'Smith'
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.attributes).to.exist;
    expect(json.data.attributes.firstName).to.be.equal('John');
    expect(json.data.attributes.lastName).to.be.equal('Smith');

  });

  it('should not have any relationships', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {});

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.relationships).to.not.exist;

  });

  it('should have a one-to-one relationship', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      email: {location: 'Home', address: 'john.smith@example.com'}
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.relationships).to.exist;
    expect(json.data.relationships.email).to.exist;

    expect(json.data.relationships.email.data).to.exist;
    expect(json.data.relationships.email.data.type)
      .to.be.equal(FIXTURE_PERSON_SCHEMA.relationships.emails)
    ;
    expect(json.data.relationships.email.data.attributes).to.exist;
    expect(json.data.relationships.email.data.attributes.location)
      .to.be.equal('Home')
    ;
    expect(json.data.relationships.email.data.attributes.address)
      .to.be.equal('john.smith@example.com')
    ;

  });

  it('should have a one-to-many relationship', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      emails: [
        {location: 'Home', address: 'johnny@example.com'},
        {location: 'Work', address: 'john.smith@example.com'}
      ]
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.relationships).to.exist;
    expect(json.data.relationships.emails).to.exist;
    expect(json.data.relationships.emails.length).to.be.equal(2);

    expect(json.data.relationships.emails[0].data.type)
      .to.be.equal(FIXTURE_PERSON_SCHEMA.relationships.emails)
    ;
    expect(json.data.relationships.emails[0].data.attributes).to.exist;
    expect(json.data.relationships.emails[0].data.attributes.location)
      .to.be.equal('Home')
    ;
    expect(json.data.relationships.emails[0].data.attributes.address)
      .to.be.equal('johnny@example.com')
    ;

    expect(json.data.relationships.emails[1].data.type)
      .to.be.equal(FIXTURE_PERSON_SCHEMA.relationships.emails)
    ;
    expect(json.data.relationships.emails[1].data.attributes).to.exist;
    expect(json.data.relationships.emails[1].data.attributes.location)
      .to.be.equal('Work')
    ;
    expect(json.data.relationships.emails[1].data.attributes.address)
      .to.be.equal('john.smith@example.com')
    ;

  });

  it('should have multiple relationships', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      email: {location: 'Home', address: 'john.smith@example.com'},
      phone: {location: 'Home', number: '02491111'}
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.relationships).to.exist;

    expect(json.data.relationships.email).to.exist;
    expect(json.data.relationships.email.data).to.exist;
    expect(json.data.relationships.email.data.type)
      .to.be.equal(FIXTURE_PERSON_SCHEMA.relationships.email)
    ;
    expect(json.data.relationships.email.data.attributes).to.exist;
    expect(json.data.relationships.email.data.attributes.location)
      .to.be.equal('Home')
    ;
    expect(json.data.relationships.email.data.attributes.address)
      .to.be.equal('john.smith@example.com')
    ;

    expect(json.data.relationships.phone).to.exist;
    expect(json.data.relationships.phone.data).to.exist;
    expect(json.data.relationships.phone.data.type)
      .to.be.equal(FIXTURE_PERSON_SCHEMA.relationships.phones)
    ;
    expect(json.data.relationships.phone.data.attributes).to.exist;
    expect(json.data.relationships.phone.data.attributes.location)
      .to.be.equal('Home')
    ;
    expect(json.data.relationships.phone.data.attributes.number)
      .to.be.equal('02491111')
    ;

  });

});
