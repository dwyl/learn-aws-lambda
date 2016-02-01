'use strict';
var test                = require('ava');
var context             = require('aws-lambda-mock-context');
var promisify           = require('aws-lambda-pify');
var createDynamoDBEvent = require('./utils/eventCreators').createDynamoDBEvent;

/**
   Create mock event and context objects
**/

var ctx               = context();
var testEvent         = { key1: 'name' }
var testDynamoDBEvent = createDynamoDBEvent();

/**
   Promisify handlers and pass in mock context
**/

var LambdaTest         = promisify(require('../functions/LambdaTest.js').handler, ctx);
var DynamoDBLambdaTest = promisify(require('../functions/DynamoDBLambdaTest.js').handler, ctx)

test('LambdaTest', async t => {
  t.is( await LambdaTest(testEvent), 'name')
})

test('DynamoDBLambdaTest', async t => {
  t.is( await DynamoDBLambdaTest(testDynamoDBEvent), 3)
})

console.log('Tests took', process.uptime(), "seconds to run");
