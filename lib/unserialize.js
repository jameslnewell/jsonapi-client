'use strict';

/**
 * Create an object from the JSON representation of a relation
 * @param   {object}  relation
 * @param   {Array}   [included]
 * @returns {object}
 */
function unserializeRelation(relation, included) {
  included = included || [];

  //get the related resource
  const related = included.find(item =>
    item.id === relation.id && item.type === relation.type
  );

  if (related) {
    return Object.assign({}, {id: related.id}, related.attributes);
  } else {
    return Object.assign({}, {id: relation.id});
  }

}

/**
 * Create an object from the JSON representation of relationships
 * @param   {object}  relationships
 * @param   {Array}   [included]
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
      object[relationshipName] = relationship.data.reduce((includedRelations, relation) => {
        includedRelations.push(unserializeRelation(relation, included));
        return includedRelations;
      }, []);
    } else if (relationship.data) {
      object[relationshipName] = unserializeRelation(relationship.data, included);
    }

  });

  return object;
}

/**
 * Create an object from a JSON representation
 * @param   {object}  object
 * @param   {Array}   [included]
 * @returns {object}
 */
function unserializeObject(object, included) {
  return Object.assign(
    object.id ? {id: object.id} : {},
    object.attributes,
    unserializeRelationships(object.relationships, included)
  );
}

/**
 * Create an object or an array of objects from a JSON representation
 * @param   {object} json
 * @returns {object}
 */
function unserialize(json) {

  //check for errors
  if (Array.isArray(json.errors)) {
    const err = new Error(json.errors[0].detail);
    err.errors = json.errors;
    console.log(json.errors[0].detail);
    throw err;
  }

  //check for an array or a single object
  if (Array.isArray(json.data)) {

    const array = json.data.map(data => unserializeObject(data, json.included));

    if (json.links && json.links.first) {
      array.first = json.links.first;
    }

    if (json.links && json.links.last) {
      array.last = json.links.last;
    }

    if (json.links && json.links.next) {
      array.next = json.links.next;
    }

    if (json.links && json.links.prev) {
      array.prev = json.links.prev;
    }

    return array;

  } else if (json.data) {
    return unserializeObject(json.data, json.included);
  } else {
    return null;
  }

}

module.exports = unserialize;