var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {
  var item = {
    Id:"1",
    notes: event.notes // notes passed in as PUT request body
  };

  var cb = function(err, data) {
    if(err) {
      console.log(err);
      context.fail('unable to update notes at this time');
    } else {
      console.log(data);
      context.done(null, data);
    }
  };
  dynamo.putItem({TableName:"Notes", Item:item}, cb);
};
