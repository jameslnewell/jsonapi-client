'use strict';

/**
 * Create an object from the JSON representation of a relation
 * @param   {object}  relation
 * @param   {array}   [included]
 * @returns {object}
 */
function unserializeRelation(relation, included) {
  included = included || [];

  //get the related resource
  const related = included.find(item =>
    item.id === relation.id && item.type === relation.type
  );

  if (!related) {
    throw new Error('Related resource was not included.'); //FIXME: throw an error because relation not found?
  }

  //unserialise the related resource
  return Object.assign({}, {id: related.id}, related.attributes);
}

/**
 * Create an object from the JSON representation of relationships
 * @param   {object}  relationships
 * @param   {array}   [included]
 * @returns {object}
 */
function unserializeRelationships(relationships, included) {
  const object = {};
  relationships = relationships || {};

  //for all relationships
  Object.keys(relationships).forEach(relationshipName => {

    const relationship = relationships[relationshipName];

    //check for an array of relations or a single relation
    if (Array.isArray(relationship.data)) {
      object[relationshipName] = relationship.data.map(relation =>
        unserializeRelation(relation, included)
      );
    } else {
      object[relationshipName] = unserializeRelation(relationship.data, included);
    }

  });

  return object;
}

/**
 * Create an object from a JSON representation
 * @param   {object}  object
 * @param   {array}   [included]
 * @returns {object}
 */
function unserializeObject(object, included) {
  //TODO: check for ID and type which are required?
  return Object.assign(
    {},
    {id: object.id},
    object.attributes,
    unserializeRelationships(object.relationships, included)
  );
}

/**
 * Create an object or an array of objects from a JSON representation
 * @param   {object} json
 * @returns {object|array}
 */
function unserialize(json) {

  //check for errors
  if (Array.isArray(json.errors)) {
    throw new Error(json.errors);
  }

  //check for an array or a single object
  if (Array.isArray(json.data)) {
    return json.data.map(data => unserializeObject(data, json.included));
  } else {
    return unserializeObject(json.data, json.included);
  }

}

module.exports = unserialize;