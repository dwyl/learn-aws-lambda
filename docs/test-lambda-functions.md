# Unit Testing Lambda Functions

## Using Lambda to test Lambda!
This method uses Lambda itself as the test platform. This involves creating a “unit” test that calls the Lambda function being tested and then either summarizes whether it succeeded or failed and/or records its output in DynamoDB. AWS lambda has a 'unit and load test harness' blueprint that you can use to test another Lambda function when it is live on AWS. The harness has two modes: 'Unit' and 'Load' so simple scale testing can also be performed.

More information and an example can be found [here](https://aws.amazon.com/blogs/compute/serverless-testing-with-aws-lambda/).

## Generating mock events and testing locally using a Node.js assertion library
The event and context objects can be mocked so that the lambda function can be tested locally before deployment. Using the 'Test' function in the AWS Lambda console it is possible to view the format of different event objects e.g. DynamoDB events, SNS notifications, etc.

Have a look at [mock-events.js](https://github.com/dwyl/learn-aws-lambda/lambda-testing/mock-events.js) to see some examples. These can be used to create helper functions to generate mock events.

The context object has the following form:
```js
{
  // methods
  success,
  done,
  fail,
  getRemainingTimeInMillis,

  // properties
  functionName,
  functionVersion,
  invokedFunctionArn,
  memoryLimitInMB,
  awsRequestId,
  logGroupName,
  logStreamName,
  identity: {
    cognito_identity_id,
    cognito_identity_pool_id
  },
  clientContext: {
    client: {
      installation_id,
      app_title,
      app_version_name,
      app_version_code,
      app_package_name,
      Custom
    },
    env: {
      platform_version,
      platform,
      make,
      model,
      locale
    }
  }
}
```

It is slightly harder to mock because the methods (`success`, `done`, `fail`) are asynchronous and also have to be mocked, but has been done on an [npm module](https://github.com/SamVerschueren/aws-lambda-mock-context) using promises.

It doesn't yet account for different invocation types i.e. Event or Request/Response. From the AWS docs about the `context.sucess` function:

> If the Lambda function is invoked using the Event invocation type (asynchronous invocation), the method will return "HTTP status 202, request accepted" response.
> If the Lambda function is invoked using the RequestResponse invocation type (synchronous invocation), the method will return HTTP status 200 (OK) and set the response > body to the string representation of the result.

The following is an example lambda function and associated test using the 'mock-context-object' module and the 'tape' assertion library.

```js
// very simple lambda function
exports.handler = function(event, context) {
  context.succeed(event.key1); // SUCCESS with message
};
```

```js
// test set up and simple test
var context = require('aws-lambda-mock-context');
var test = require('tape');
var lambdaToTest = require('../functions/lambdaTest.js');

// creating context object
var ctx = context();

// text event object
var testEvent = {
  key1: 'name'
};

var response = null;
var error = null;

test("Capture response", t => {
  lambdaToTest.handler(testEvent, ctx);

  // capture the response or errors
  ctx.Promise
    .then(resp => {
      response = resp;
      t.end();
    })
    .catch(err => {
      error = err;
      t.end();
    });
});

test("Check response", t => {
  t.equals(response, 'name');
  t.end();
});
```

More info on testing lambda functions locally can be found [here](https://medium.com/@AdamRNeary/developing-and-testing-amazon-lambda-functions-e590fac85df4#.romz6yjwv) and an example of testing by mocking the context object can be found [here](http://codedad.net/2016/01/03/test-aws-lambda-function-without-aws/).

## Using grunt-aws-lambda plugin
This plugin for Grunt has helpers for running Lambda functions locally as well as for packaging and deployment of Lambda functions.

More info and an example can be found [here](https://aws.amazon.com/blogs/compute/continuous-integration-deployment-for-aws-lambda-functions-with-jenkins-and-grunt-part-1/).
