var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var lambda = new AWS.Lambda();

exports.handler = function(event, context) {
  var params = {
    FunctionName: 'Lambda_B', // the lambda function we are going to invoke
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: '{ "name" : "Alex" }'
  };
  console.log(params);
  console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');

  function invokeFunction() {
    lambda.invoke(params, function(err, data) {
      if (err) {
        context.fail(err);
      } else {
        context.succeed('Lambda_B said '+ data.Payload);
      }
    })
  }
  // first check that the
  lambda.getFunction({ FunctionName: params.FunctionName }, function(err, data) {
    if (err) {
      context.fail(params.FunctionName + 'FUNCTION NOT FOUND', err);
    } else {
      console.log(data);
      console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
      invokeFunction();
    }
  });
};
