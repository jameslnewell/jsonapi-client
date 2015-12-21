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

  it('should have a null relationship', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      email: null
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.relationships).to.exist;

    expect(json.data.relationships.email).to.exist;
    expect(json.data.relationships.email.data).to.be.equal(null);

  });

  it('should have a one-to-one relationship', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      email: {id: 12, location: 'Home', address: 'john.smith@example.com'}
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.relationships).to.exist;

    expect(json.data.relationships.email).to.exist;
    expect(json.data.relationships.email.data).to.exist;

    expect(json.data.relationships.email.data).to.be.deep.equal({
      id: 12,
      type: FIXTURE_PERSON_SCHEMA.relationships.email
    });

  });

  it('should have a one-to-many relationship', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      emails: [
        {id: 13, location: 'Home', address: 'johnny@example.com'},
        {id: 42, location: 'Work', address: 'john.smith@example.com'}
      ]
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.relationships).to.exist;

    expect(json.data.relationships.emails).to.exist;
    expect(json.data.relationships.emails.data).to.be.an('array');
    expect(json.data.relationships.emails.data.length).to.be.equal(2);

    expect(json.data.relationships.emails.data[0]).to.be.deep.equal({
      id: 13,
      type: FIXTURE_PERSON_SCHEMA.relationships.emails
    });

    expect(json.data.relationships.emails.data[1]).to.be.deep.equal({
      id: 42,
      type: FIXTURE_PERSON_SCHEMA.relationships.emails
    });

  });

  it('should have multiple relationships', () => {

    const json = serialize(FIXTURE_PERSON_SCHEMA, {
      email: {id: 13, location: 'Home', address: 'john.smith@example.com'},
      phone: {id: 42, location: 'Home', number: '02491111'}
    });

    expect(json).to.exist;
    expect(json.data).to.exist;
    expect(json.data.relationships).to.exist;


    expect(json.data.relationships.email.data).to.be.deep.equal({
      id: 13,
      type: FIXTURE_PERSON_SCHEMA.relationships.email
    });

    expect(json.data.relationships.phone.data).to.be.deep.equal({
      id: 42,
      type: FIXTURE_PERSON_SCHEMA.relationships.phone
    });

  });

  it('should throw an error when a related object does not have an ID', () => {

    expect(
      () => serialize(FIXTURE_PERSON_SCHEMA, {
        email: {location: 'Home', address: 'john.smith@example.com'}
      })
    ).to.throw();

  });

});
