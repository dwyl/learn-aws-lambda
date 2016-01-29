'use strict';

var context = require('aws-lambda-mock-context');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

var lambdaToTest = require('../functions/LambdaTest.js');

// creating context object
var ctx = context();
// text event object
var testEvent = require('./data.json');

var response = null;
var error = null;

describe('Test a simple Lambda function', function(){
  it("Capture response", function(done) {
    lambdaToTest.handler(testEvent, ctx);
    //capture the response or errors
    ctx.Promise
      .then(function(resp) {
        response = resp;
        done();
      })
      .catch(function(err) {
        error = err;
        done();
      })
  });

  it("Check response", function(done) {
    expect(response).to.equal('name');
    done();
  })
});
