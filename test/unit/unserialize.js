'use strict';

const expect = require('chai').expect;
const unserialize = require('../../lib/unserialize');

describe('unserialize()', () => {

  it('should throw an error when the JSON contains an array of errors', () => {

    const json = {
      errors: [{
        title: 'A test error!'
      }]
    };
    expect(() => {
      unserialize(json);
    }).to.throw(Error);

  });

  it('should return null', () => {

    const obj = unserialize({
      data: null
    });

    expect(obj).to.equal(null);

  });

  it('should return a single object with an ID', () => {

    const obj = unserialize({
      data: {id: 12}
    });

    expect(obj).to.deep.equal({
      id: 12
    });

  });

  it('should return a single object with a property', () => {

    const obj = unserialize({
      data: {
        attributes: {
          firstName: 'John'
        }
      }
    });

    expect(obj).to.deep.equal({
      firstName: 'John'
    });

  });

  it('should return a single object with multiple properties', () => {

    const obj = unserialize({
      data: {
        attributes: {
          firstName: 'John',
          lastName: 'Smith'
        }
      }
    });

    expect(obj).to.deep.equal({
      firstName: 'John',
      lastName: 'Smith'
    });

  });

  it('should return a single object with just an id when the related objects are not included for a single relationship', () => {

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
      }
    });

    expect(obj).to.exist;
    expect(obj.email).to.deep.equal({id: 12});

  });

  it('should return multiple objects with just an id when the related objects are not included for multiple relationships', () => {

    const obj = unserialize({
      data: {
        relationships: {
          emails: {
            data: [
              {
                type: 'Email',
                id: 12
              }
            ]
          }
        }
      }
    });

    expect(obj).to.exist;
    expect(obj.emails).to.be.an('array');
    expect(obj.emails[0]).to.deep.equal({id: 12});

  });

  it('should return a single object with no relation when there are no related objects', () => {

    const obj = unserialize({
      data: {
        relationships: {
          email: {
            links: {
              related: 'http://localhost/email'
            }
          }
        }
      }
    });

    expect(obj).to.exist;
    expect(obj.email).to.equal(undefined);

  });

  it('should return a single object with a one-to-one relationship', () => {

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

  it('should return a single object with a one-to-many relationship', () => {

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

  it('should return a single object with multiple relationships', () => {

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

  it('should return an empty array', () => {

    const objects = unserialize({
      data: []
    });

    expect(objects).to.be.an('array');
    expect(objects.length).to.be.equal(0);

  });

  it('should return a multiple objects', () => {

    const objects = unserialize({
      data: [
        {type: 'Person', id: 12, attributes: {firstName: 'John', lastName: 'Smith'}},
        {type: 'Person', id: 41, attributes: {firstName: 'Lindsey', lastName: 'Brown'}, relationships: {email: {
          data: {type: 'Email', id: 33}
        }}}
      ],
      included: [
        {type: 'Email', id: 33, attributes: {
          location: 'Home',
          address: 'lindsey@brown.com'
        }}
      ]
    });

    expect(objects).to.be.an('array');

    expect(objects[0]).to.be.deep.equal({
      id: 12,
      firstName: 'John',
      lastName: 'Smith'
    });

    expect(objects[1]).to.be.deep.equal({
      id: 41,
      firstName: 'Lindsey',
      lastName: 'Brown',
      email: {
        id: 33,
        location: 'Home',
        address: 'lindsey@brown.com'
      }
    });

  });

});
