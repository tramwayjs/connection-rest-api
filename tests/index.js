const assert = require('assert');
const lib = require('../index.js');

const DEFAULT_CLASS_PROPERTY_NAMES = ['length', 'name', 'prototype'];

/**
 * @param {[]} a
 * @param {[]} b
 * @returns {[]}
 */
function getArrayDifference(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;})
}

/**
 * @param {[]} a
 * @param {[]} b
 * @returns {[]}
 */
function getDeepArrayDifference(a, b) {
    return getArrayDifference(a, b)
        .concat(getArrayDifference(b, a))
        .filter(function(item, index, inputArray ) {
            return inputArray.indexOf(item) == index;
        });
}

/**
 * @param {Object} libClass
 * @param {string} expectedClass
 * @param {string[]} expectedStaticPros
 * @param {string[]} expectedNonStaticProps
 * @returns
 */
function describeCoreClass(libClass, expectedClass, expectedStaticPros, expectedNonStaticProps) {
    return function() {
        const ACTUAL_INTERFACE = Object.getOwnPropertyNames(libClass);
        const EXPECTED_INTERFACE = DEFAULT_CLASS_PROPERTY_NAMES.concat(expectedStaticPros);

        it("Should return a '" + expectedClass + "' class at the corresponding key", function(){
            assert.strictEqual(libClass.name, expectedClass);
        });

        it("Should not add new static functions. If so please update tests and version.", function(){       
            assert.deepEqual(getArrayDifference(ACTUAL_INTERFACE, EXPECTED_INTERFACE), []);
        });

        it("Should not remove any static functions. If so please update tests and version.", function(){
             assert.deepEqual(getArrayDifference(EXPECTED_INTERFACE, ACTUAL_INTERFACE), []);
        });
    }
}

function describeCoreExternalClass(libClass, expectedClass) {
    return function() {
        it("Should return a '" + expectedClass + "' class at the corresponding key", function(){
            assert.strictEqual(libClass.name, expectedClass);
        });
    }
}

describe("Simple acceptance tests to ensure library returns what's promised.", function(){
    describe("Should return a proper 'RestAPIConnection' class", describeCoreClass(
        lib.default, 
        "RestAPIConnection", 
        [],
        ["getItem", "getItems", "getAllItems", "findItems", "hasItem", "hasItems", "countItems", "createItem", "updateItem", "deleteItem", "deleteItems", "query"]
    ));
});