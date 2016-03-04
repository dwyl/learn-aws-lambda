# Invoking a Lambda from within a Lambda

Our objective is to invoke a Lambda Function from another Lambda Function.

Lambda_A invokes Lambda_B
with a `payload` containing a single parameter `name:'Alex'`.
Lambda_B replies "Hello Alex".

`Lambda_A`:
```js

```

`Lambda_B`:
```js
exports.handler = function(event, context) {
  console.log('Lambda B Received event:', JSON.stringify(event, null, 2));
  context.succeed('Hello ' + event.name);
};
```

## Check the Function we are invoking *Exists*

The way we end up writing our functions is to first check
that the lambda function being invoked actually *exisits*,
and then *invoke* it based on its availability.

```js
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
```
