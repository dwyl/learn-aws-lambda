'use strict';

var Code                = require('code');
var Lab                 = require('lab');
var lab                 = exports.lab = Lab.script();
var describe            = lab.experiment;
var expect              = Code.expect;
var it                  = lab.test;
var createDynamoDBEvent = require('./utils/eventCreators').createDynamoDBEvent;

/**
   Handlers
**/
var LambdaTest         = require('../functions/lambdaTest.js').handler
var DynamoDBLambdaTest = require('../functions/DynamoDBLambdaTest.js').handler

/**
   Create mock event and context objects
**/
var contextCreator      = require('./utils/mockContext.js');
var testEvent           = { key1: 'name' }
var testDynamoDBEvent   = createDynamoDBEvent();

describe('LambdaTest', function(){
  it("LambdaTest: returns value when given event with key1 property", function(done) {

    function test(result){
      expect(result).to.equal("name")
      done();
    }
    var context = contextCreator(test);
    LambdaTest(testEvent, context);
  })
  it("LambdaTest: returns error when given empty event", function(done) {
    function test(error){
      expect(error).to.equal("no key1")
      done();
    }
    var context = contextCreator(test);
    LambdaTest({}, context);
  })
})

describe('DynamoDB Triggered Lambda Test', function(){
  it("DynamoDBTest: returns number of records in the event", function(done) {

    function test(result){
      expect(result).to.equal(3)
      done();
    }
    var context = contextCreator(test);

    DynamoDBLambdaTest(testDynamoDBEvent, context);
  })
})
