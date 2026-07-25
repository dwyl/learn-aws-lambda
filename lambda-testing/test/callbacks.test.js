'use strict';
import tap from 'tap';
const test = tap.test;
const createDynamoDBEvent = require('./utils/eventCreators').createDynamoDBEvent;

/**
   Handlers
**/
import * as LambdaTest from '../functions/lambdaTest.js'
import * as DynamoDBLambdaTest from '../functions/DynamoDBLambdaTest.js'

/**
   Create mock event and context objects
**/
const contextCreator      = require('./utils/mockContext.js');
const testEvent           = { key1: 'name' }
const testDynamoDBEvent   = createDynamoDBEvent();

test('LambdaTest: returns value given event with key1 property', function(t) {
  function test(result) {
    t.equal(result, "name")
    t.end();
  }
  const context = contextCreator(test);
  LambdaTest(testEvent, context);
});

test("LambdaTest: returns error when given empty event", function(t) {
  function test(error) {
    t.equal(error, "no key1");
    t.end();
  }
  const context = contextCreator(test);
  LambdaTest({}, context);
})

test("DynamoDBTest: returns number of records in the event", function(t) {
  function test(result) {
    t.equal(result, 3)
    t.end();
  }
  const context = contextCreator(test);
  DynamoDBLambdaTest(testDynamoDBEvent, context);
})
