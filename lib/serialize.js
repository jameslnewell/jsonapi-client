
/**
 * Serialize a related object into JSON
 * @param   {string} type
 * @param   {object} object
 * @returns {object}
 */
function serialiseRelated(type, object) {

  if (object === null) {
    return null;
  }

  if (typeof object.id === 'undefined') {
    throw new Error('Related resource must have an ID.');
  }

  return {
    id: object.id,
    type
  };

}

/**
 * Serialize an object into JSON
 * @param   {object} schema
 * @param   {string} schema.type
 * @param   {object} [schema.relationships]
 * @param   {object} object
 * @returns {object}
 */
module.exports = function serialiseObject(schema, object) {

  const json = {
    data: {
      type: schema.type
    }
  };

  Object.keys(object).forEach(property => {

    //handle the ID
    if (property === 'id') {
      json.data[property] = object[property];
      return;
    }

    //handle a relationship
    if (schema.relationships && schema.relationships[property]) {

      if (typeof json.data.relationships === 'undefined') {
        json.data.relationships = {};
      }

      if (Array.isArray(object[property])) {
        json.data.relationships[property] = {
          data: object[property].map(
            relation => serialiseRelated(schema.relationships[property], relation)
          )
        };
      } else {
        json.data.relationships[property] = {
          data: serialiseRelated(schema.relationships[property], object[property])
        };
      }

      return;
    }

    //handle an attribute
    if (typeof json.data.attributes === 'undefined') {
      json.data.attributes = {};
    }
    json.data.attributes[property] = object[property];

  });

  return json;
};
