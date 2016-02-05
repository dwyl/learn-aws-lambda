var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = fucntion(event, context) {
  var item = { username:"default",
               users: event.users || {}
          };

  var callback = function(err, data) {
    if (err) {
      console.log(err);
      context.fail('unable to update users at this time');
    } else {
      console.log(data);
      context.done(null, data);
    }
  };

  dynamo.putItem({TableName:"Users", Item:item}, callback);
};
