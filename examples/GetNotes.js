var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {
  var cb = function(err, data) {
    if(err) {
      console.log('error on GetNotes: ',err);
      context.done('Unable to retrieve notes', null);
    } else {
      if(data.Item && data.Item.notes) {
        context.done(null, data.Item);
      } else {
        context.done(null, {});
      }
    }
  };
  dynamo.getItem({TableName:"Notes", Key:{Id:"1"}}, cb);
};
