'use strict';

const expect = require('chai').expect;
const unserialize = require('../lib/unserialize');

describe('unserialize()', () => {

  it('should throw an error', () => {

    const json = {
      errors: [{
        title: 'A test error!'
      }]
    };
    expect(() => {
      unserialize(json);
    }).to.throw(Error);

  });

  it('should have an ID', () => {

    const obj = unserialize({
      data: {id: 12}
    });

    expect(obj).to.exist;
    expect(obj.id).to.be.equal(12);

  });

  it('should have a property', () => {

    const obj = unserialize({
      data: {
        attributes: {
          firstName: 'John'
        }
      }
    });

    expect(obj).to.exist;
    expect(obj.firstName).to.exist;
    expect(obj.firstName).to.be.equal('John');

  });

  it('should have multiple properties', () => {

    const obj = unserialize({
      data: {
        attributes: {
          firstName: 'John',
          lastName: 'Smith'
        }
      }
    });

    expect(obj).to.exist;
    expect(obj.firstName).to.exist;
    expect(obj.firstName).to.be.equal('John');
    expect(obj.lastName).to.be.equal('Smith');

  });

  it('should have a one-to-one relationship', () => {

    const obj = unserialize({
      data: {
        relationships: {
          email: {
            data: {
              type: 'Email',
              id: 12
            }
          }
        }
      },
      included: [{
        type: 'Email',
        id: 12,
        attributes: {
          location: 'Home',
          address: 'john.smith@example.com'
        }
      }]
    });

    expect(obj).to.exist;
    expect(obj.email).to.exist;
    expect(obj.email.location).to.be.equal('Home');
    expect(obj.email.address).to.be.equal('john.smith@example.com');

  });

  it('should have a one-to-many relationship', () => {

    const obj = unserialize({
      data: {
        relationships: {
          emails: {
            data: [
              {
                type: 'Email',
                id: 12
              },
              {
                type: 'Email',
                id: 13
              }
            ]
          }
        }
      },
      included: [
        {
          type: 'Email',
          id: 12,
          attributes: {
            location: 'Home',
            address: 'johnny@example.com'
          }
        },
        {
          type: 'Email',
          id: 13,
          attributes: {
            location: 'Work',
            address: 'john.smith@example.com'
          }
        }
      ]
    });

    expect(obj).to.exist;
    expect(obj.emails).to.be.an('array');
    expect(obj.emails.length).to.be.equal(2);

    expect(obj.emails[0].location).to.be.equal('Home');
    expect(obj.emails[0].address).to.be.equal('johnny@example.com');

    expect(obj.emails[1].location).to.be.equal('Work');
    expect(obj.emails[1].address).to.be.equal('john.smith@example.com');

  });

  it('should have multiple relationships', () => {

    const obj = unserialize({
      data: {
        relationships: {
          email: {
            data: {
              type: 'Email',
              id: 12
            }
          },
          phone: {
            data: {
              type: 'Phone',
              id: 13
            }
          }
        }
      },
      included: [
        {
          type: 'Email',
          id: 12,
          attributes: {
            location: 'Home',
            address: 'johnny@example.com'
          }
        },
        {
          type: 'Phone',
          id: 13,
          attributes: {
            location: 'Home',
            address: '0249111111'
          }
        }
      ]
    });

    expect(obj).to.exist;

    expect(obj.email).to.exist;
    expect(obj.email.location).to.be.equal('Home');
    expect(obj.email.address).to.be.equal('johnny@example.com');

    expect(obj.phone).to.exist;
    expect(obj.phone.location).to.be.equal('Home');
    expect(obj.phone.address).to.be.equal('0249111111');

  });

});
