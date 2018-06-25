const assert = require('assert');
const utils = require('tramway-core-testsuite');
const lib = require('../index.js');
var describeCoreClass = utils.describeCoreClass;
var describeFunction = utils.describeFunction;

describe("Simple acceptance tests to ensure library returns what's promised.", function(){
    describe("Should return a proper 'RestApiProvider' class", describeCoreClass(
        lib.default, 
        "RestApiProvider", 
        [],
        ["get", "getOne", "getMany", "has", "hasThese", "create", "update", "delete", "deleteMany", "preparePath", "prepareOptions", "sendRequest"]
    ));

    describe("Should return an object for services.", function(){
        it("Should return an object for services.", function(){
            assert.strictEqual(typeof lib.services, "object");
        });
        it("There should be the same services as in the previous version", function(){
            assert.deepEqual(Object.keys(lib.services), ["ServerIPResolverService"]);
        });
        describe("Should return a proper 'ServerIPResolverService' class", describeCoreClass(
            lib.services.ServerIPResolverService, 
            "ServerIPResolverService", 
            ['getIp'],
            []     
        ));
    });
});