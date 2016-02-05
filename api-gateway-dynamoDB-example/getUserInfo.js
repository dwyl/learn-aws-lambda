var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {
  var callback = function(err, data) {
    if (err) {
      console.log('error on getUserInfo: ', err);
      context.done('Unable to retrieve user information', null);
    } else {
      if(data.Item && data.Item.users) {
        context.done(null, data.Item.users);
      } else {
        context.done(null, {});
      }
    }
  };

  dynamo.getItem({TableName:"Users", Key:{username:"default"}}, callback);
};
