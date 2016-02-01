'use strict';

var context             = require('aws-lambda-mock-context');
var promisify           = require('aws-lambda-pify');
var Code                = require('code');
var Lab                 = require('lab');
var lab                 = exports.lab = Lab.script();
var describe            = lab.experiment;
var expect              = Code.expect;
var it                  = lab.test;
var createDynamoDBEvent = require('./utils/eventCreators').createDynamoDBEvent;

/**
   Create mock event and context objects
**/
var ctx                 = context();
var testEvent           = { key1: 'name' }
var testDynamoDBEvent   = createDynamoDBEvent();

/**
   Promisify handlers and pass in mock context
**/
var LambdaTest         = promisify(require('../functions/LambdaTest.js').handler, ctx);
var DynamoDBLambdaTest = promisify(require('../functions/DynamoDBLambdaTest.js').handler, ctx)


describe('LambdaTest', function(){
  it("LambdaTest: returns value when given event with key1 property", function(done) {
    LambdaTest(testEvent)
      .then(function(response) {
        expect(response).to.equal('name');
        done();
      })
  })
  it("LambdaTest: returns error when given empty event", function(done) {
    LambdaTest({})
      .then()
      .catch(function(error){
        expect(error).to.equal('no key1');
        done();
      })
  })
})

describe('DynamoDB Triggered Lambda Test', function(){
  it("DynamoDBTest: returns number of records in the event", function(done) {
    DynamoDBLambdaTest(testDynamoDBEvent)
      .then(function(response) {
        expect(response).to.equal(3); // three records in the event
        done();
      })
  })
})
