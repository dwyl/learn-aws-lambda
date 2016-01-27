'use strict';

var context = require('aws-lambda-mock-context');
var test = require('tape');

var lambdaToTest = require('../functions/LambdaTest.js');

// creating context object
var ctx = context();
// text event object
var testEvent = require('./data.json');

var response = null;
var error = null;

test("Capture response", t => {
  lambdaToTest.handler(testEvent, ctx);
  //capture the response or errors
  ctx.Promise
    .then(resp => {
      response = resp;
      t.end();
    })
    .catch(err => {
      error = err;
      t.end();
    })
})

test("Check response", t => {
  t.equals(response, 'name');
  t.end();
})
