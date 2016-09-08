'use strict';
/**
 Mock Context object for testing. Takes a callback function which will be called with the value passed into
 the context method

 Example usage in a test:

  var contextCreator      = require('./utils/mockContext.js');
  var testEvent           = { key1: 'value1'}

  describe('LambdaTest', function(){
    it("LambdaTest: returns value when given event with key1 property", function(done) {

      function test(result){
        expect(result).to.equal("value1")
        done();
      }

      var context = contextCreator(test);

      Handler(testEvent, context);
    })
  })

**/
module.exports = function(cb) {
  return {
    succeed: function (result) {
      console.log('succeed: ' + result);
      cb(result);
    },
    fail: function (error) {
      console.log('fail: ' + error);
      cb(error);
    }
  }
};
