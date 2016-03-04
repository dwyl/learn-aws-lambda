var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var lambda = new AWS.Lambda();

exports.handler = function(event, context) {

  var params = {
    FunctionName: 'GetNotes',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: '{ "key1" : "name" }'
  };
  console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
  console.log(params);
  console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');

  function invokeFunction() {
    lambda.invoke(params, function(err, data) {
      if (err) { console.log(err, err.stack); }
      else { console.log(data); }

        console.log('a executed');
        context.succeed(data);
    })
  }

  lambda.getFunction({ FunctionName: 'GetNotes' }, function(err, data) {
    if (err) {
      console.log("FUNCTION NOT FOUND", err);
    } else {
      console.log(data);
      console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
      invokeFunction();
    }
  });
};
