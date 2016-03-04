# Invoking a Lambda from within a Lambda

Our objective is to invoke a Lambda Function from another Lambda Function.

## How?

> Start with something *simple*: the "Hello World" of intra-lambda invocation:

`Lambda_A` invokes `Lambda_B`
with a `payload` containing a single parameter `name:'Alex'`.  
`Lambda_B` responds with Payload: `"Hello Alex"`.

![lambda invoke](https://cloud.githubusercontent.com/assets/194400/13526240/ac778494-e1fe-11e5-8462-816a0b85ed3d.jpg)

First create `Lambda_B` which expects a `name` *property*
on the `event` parameter  
and responds to request with `"Hello "+event.name`:

`Lambda_B`
```js
exports.handler = function(event, context) {
  console.log('Lambda B Received event:', JSON.stringify(event, null, 2));
  context.succeed('Hello ' + event.name);
};
```
Ensure that you give `Lambda_B` and `Lambda_A` the same role.
We created a new role `lambdaexecute` which has both `AWSLambdaExecute` *and*
`AWSLambdaBasicExecutionRole` (*for some reason both were required*):

![lambda-role-for-intra-lambda-execution](https://cloud.githubusercontent.com/assets/194400/13526641/15a146c4-e201-11e5-88c1-c70c9eda2bfb.png)

`Lambda_A`
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

  lambda.invoke(params, function(err, data) {
    if (err) {
      context.fail(err);
    } else {
      context.succeed('Lambda_B said '+ data.Payload);
    }
  })
};
```
Once you have saved both these Lambda functions, Test run `Lambda_A`:

![lambda invoke-lambda_a-execution-result](https://cloud.githubusercontent.com/assets/194400/13526744/ec22a062-e201-11e5-8c7b-6bea3b437bd4.png)


## Check the Function we are invoking *Exists* before Invoking

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

  function invokeFunction() {
    lambda.invoke(params, function(err, data) {
      if (err) {
        context.fail(err);
      } else {
        context.succeed('Lambda_B said '+ data.Payload);
      }
    })
  }
  // check that the Lambda Function you want to invoke exists before invoking
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
