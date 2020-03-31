# Learn Aws Lambda

![aws lambda intro image](http://i.imgur.com/9ImDKrv.jpg)

Learn to use AWS Lambda to create scalable micro-services in less time
and cost *far* less to run than "*traditional*" server-based apps.

[![Codeship](https://img.shields.io/codeship/dc9ad800-a8a7-0133-6c3b-2a9c037ce78e/master.svg?style=flat-square)](https://github.com/codeship/documentation/issues/335)
[![codecov.io](https://codecov.io/github/dwyl/learn-aws-lambda/coverage.svg?branch=master)](https://codecov.io/github/dwyl/learn-aws-lambda?branch=master)
[![dependencies Status](https://david-dm.org/dwyl/learn-aws-lambda/status.svg)](https://david-dm.org/dwyl/learn-aws-lambda)
[![devDependencies Status](https://david-dm.org/dwyl/learn-aws-lambda/dev-status.svg)](https://david-dm.org/dwyl/learn-aws-lambda?type=dev)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/learn-aws-lambda/issues)


## Contents

* [What is Lambda?](#what-is-lambda)
* [How does it work?](#how)
* [Create and Test Your Own AWS Lambda Function](#create-and-test-your-own-aws-lambda-function)
* [Further Reading](#further-reading)
* [Glossary](#glossary)
* [Concerns](#concerns)
* [Pricing](#lambda-pricing)
* [FAQ](#faq)

## What is Lambda?

Amazon Web Services (AWS) Lambda lets you run JavaScript (Node.js), Java & Python
scripts/apps in Amazon's (virtually) infinitely-scalable cloud environment
without having provision VM instances or other "*orchestration*";
Everything is dynamically auto-scaled so if you have 1 user or 1 billion
you pay for *usage*.

### *Self*-Disruption

AWS are effectively [*disrupting*](https://en.wikipedia.org/wiki/Disruptive_innovation)
their (*own*) *existing* business with Lambda.
Instead of forcing us to pay for EC2 instances in fixed increments and
have complex application monitoring/scaling, AWS have
built a *much simpler* way of building & running *micro-services*.

Lambda also disrupts other Platform-as-a-Service ("**PaaS**") providers
such as Heroku, Google App Engine, Azure or Modulus where you pay for a
*specific* amount of compute power & RAM but have a ***scaling delay*** and
scale in a ***fixed increment*** (instances).

### Lambda Features

#### Ephemeral Storage

No access to a filesystem or memory persistence (e.g. on-instance Redis)
so you cannot store data or the `result` of an operation *locally*.

#### Use an AWS Datastore Service

The lack of *local* persistence on Lambda is resolved by having
low-latency access to AWS S3 and *other* AWS Datastores e.g:
[ElastiCache](https://aws.amazon.com/elasticache/) (in-memory cache),
[DynamoDB](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) (NoSQL ssd-based database),
[RDS](https://aws.amazon.com/rds/) (*relational database*),
however there's an
important (and potentially *expensive*) catch: PUT/POST/GET requests to all
AWS data stores are **NOT** Free! While per-run costs on Lambda are tiny, if you GET and PUT
something to S3 on each execution cycle you could rack up the bill!

## *How*?

+ General Intro (*if you're completely new, watch the video!*): http://aws.amazon.com/lambda/
+ How it Works: http://docs.aws.amazon.com/lambda/latest/dg/lambda-introduction.html
+ Getting Started Guide (Overview): http://docs.aws.amazon.com/lambda/latest/dg/welcome.html

## Create and Test Your Own AWS Lambda Function

* [Create a Lambda function inline](/docs/create-lambda-inline.md)
* [Create a Lambda function using a .zip folder](/docs/create-lambda-inline-zip.md)
* [Create a Lambda function using the AWS API Gateway](/docs/create-lambda-api-gateway.md)
* [Access a Lambda function via API Gateway](/docs/access-lambda-api-gateway.md)
* [Use the callback parameter with node v4.3](/docs/callback-param-node43.md)
* [Trigger a Lambda function using an event from DynamoDB](/docs/trigger-lambda-dynamodb.md)
* [Trigger a Lambda function using the Simple Notification System](/docs/trigger-lambda-sns.md)
* [Trigger a Lambda function when an email comes in to the AWS Simple Email Service (SES)](#trigger-a-lambda-function-when-an-email-is-received-by-amazon-simple-email-service)
* [Continuous Integration using Codeship](#continuous-integration-using-codeship)
* [Testing Lambda Functions](#testing-lambda-functions)
* [Upload Lambda Function to S3 and deploy to Lambda](#upload-your-lambda-function-to-an-s3-bucket-and-automatically-deploy-it-to-lambda-bash-script-example)
* [Deploying Lambda Functions using Gulp](#deploying-lambda-functions-using-gulp)
* [Versioning and Aliasing Lambda Functions](#versioning-and-aliasing-lambda-functions)
* [Create an API with GET/POST Methods using Lambda functions to retrieve/update records from a DynamoDB table](#create-an-api-with-getpost-methods-that-uses-lambda-functions-to-retrieveupdate-records-from-a-dynamodb-table-1)

### Create an API with GET/POST Methods that uses Lambda functions to retrieve/update records from a DynamoDB table

1. First we'll need to create a table in DynamoDB. Go to the DynamoDB console and then click the 'Create Table' button. Give your table a name _(call it something relevant to the type of data your DynamoDB table will hold)_. We've called ours 'Users'. The 'Primary key' is made up of a 'Partition key' _(hash key)_ and an optional 'Sort key'. _(The partition key is used to partition data across hosts for scalability and availability)_:


  ![create table](https://cloud.githubusercontent.com/assets/5912647/12557398/7114929c-c382-11e5-9c48-5c2bf15649ac.png)

  ![table name](https://cloud.githubusercontent.com/assets/12450298/12714300/c9a4e152-c8cb-11e5-8c35-370393cef70e.png)

  For 'Table settings' just check the 'Use default settings' checkbox and then click the blue 'Create' button:

  ![table setup](https://cloud.githubusercontent.com/assets/12450298/12714466/db3a51d0-c8cc-11e5-882f-a3b09df203a4.png)

2. Once the table is created, click on the 'Alarms' tab and then delete the basic alarms if they have been created:

  ![alarms](https://cloud.githubusercontent.com/assets/12450298/12714608/9da7b6ea-c8cd-11e5-8b5c-f09f94d3e66a.png)

  Then click on the 'Capacity' tab and then specify the 'Read' and 'Write' capacity units as 3 each and then click 'Save':

  ![capacity](https://cloud.githubusercontent.com/assets/12450298/12714552/5fe19b1e-c8cd-11e5-919a-780c3bb06316.png)

3. Next we will have to create a policy that allows your AWS functions to access Cloudwatch logs as well as the table you just created. Go to the IAM console, select 'Roles' and then 'Create new role'. We've called ours 'APIGatewayLambdaExecRole':

  ![create role](https://cloud.githubusercontent.com/assets/12450298/12714889/11c25804-c8cf-11e5-8b32-e01f9673b8cf.png)

  Select the 'AWS Lambda' role:

  ![lambda role](https://cloud.githubusercontent.com/assets/12450298/12714963/651140f6-c8cf-11e5-87f5-f547605f757a.png)

  And then click 'Next step' to skip the 'Attach Policy' section:

  ![skip attach policy](https://cloud.githubusercontent.com/assets/12450298/12714986/8de42822-c8cf-11e5-9fc8-9aad5ed4b799.png)

  In the 'Review' section click the blue 'Create Role' button to finish:

  ![review role](https://cloud.githubusercontent.com/assets/12450298/12715013/bcb3bc1c-c8cf-11e5-8fce-37f32546d0b5.png)

  Click on the title of the role you just created then click the down arrow for 'Inline Policies'. Follow the link to create an inline policy:

  ![inline policies](https://cloud.githubusercontent.com/assets/12450298/12715091/385b678e-c8d0-11e5-8006-1d65487b933e.png)

  Click on the 'Custom Policy' radio button and then click 'Select':

  ![custom policy](https://cloud.githubusercontent.com/assets/12450298/12715150/857ad6e4-c8d0-11e5-9688-c6237746e742.png)

  Give your custom policy a name _(we've called ours 'LogAndDynamoDBAccess')_ and then enter the following in the 'Policy Document' section. **Make sure your "Resource" at the bottom is set to the ARN of your table and the second "SID" is set to "_YourTableName_DynamoDBReadWrite"**. _(the ARN can be found in your 'Table details' by going to your DynamoDB console and clicking on your table.)_:

  ```
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AccessCloudwatchLogs",
            "Action": [
                "logs:*"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:logs:*:*:*"
        },
        {
            "Sid": "UsersDynamoDBReadWrite",
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:eu-west-1:655240720487:table/Users"
            ]
        }
    ]
  }
  ```

4. Now we need to create the Lambda functions for adding and retrieving data to and from the table _(we'll be creating our functions in a text editor, zipping them up and then uploading them to Lambda. Follow the instructions in the previous 'HELLO WORLD!' .zip example on how to do this)_:

  Create a new ```.js``` file that will contain our first Lambda function. This function will GET information from the DynamoDB table. We've called the file ```getUserInfo.js```. Here is the code:

  ```JavaScript
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
  ```
  Zip up the file and then upload it to Lambda:

  ```zip -r getUserInfo.zip getUserInfo.js```

  ![getuserinfo](https://cloud.githubusercontent.com/assets/12450298/12716616/ceb37a6a-c8d9-11e5-80be-54ebf8b9754d.png)

  For the Role, select the one we created earlier. Then click 'Next' and then 'Create function':

  ![role](https://cloud.githubusercontent.com/assets/12450298/12716846/6d4dcd82-c8db-11e5-9b01-3dccc12d8fa5.png)

  Click 'Test' to test the function. The results should return an empty objext ```{}```.

  Create a second ```.js``` file that will contain our second Lambda function. This function will UPDATE information in our DynamoDB table. We've called the file ```updateUserInfo.js```. Here is the code:

  ```JavaScript
  var AWS = require('aws-sdk');
  var DOC = require('dynamodb-doc');
  var dynamo = new DOC.DynamoDB();

  exports.handler = function(event, context) {
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
  ```
  Again zip up the file and then upload it to Lambda:
  ```zip -r updateUserInfo.zip updateUserInfo.js```

  Follow the same steps as the previous function to create the second one, giving it the same role. They should both now appear in your functions section:

  ![functions](https://cloud.githubusercontent.com/assets/12450298/12717241/7e1805bc-c8de-11e5-9c0c-9974a961cef7.png)

  Test the function with a sample event relevant to your data. We created the following sample event:
  ```
  {
    "users": [
              {
                "id": 1,
                "name": "John Smith",
                "location": "London"

              }
             ]
  }
  ```
  You should see an empty obect just like the first function ```{}```.
  Go back to the GetUserInfo function and then click 'Test' again. You should now see a returned result with the object in your sample event like this:

  ```
  [
    {
      "id": 1,
      "location": "London",
      "name": "John Smith"
    }
  ]
  ```
5. We're going to have to create one more Lambda function. It essentially does nothing but it is required by the OPTIONS method for CORS _(Cross Origin Resource Sharing which is a mechanism that allows restricted resources on a web page to be requested from )_. The function is as follows:

  ```JavaScript
    exports.handler = function(event, context) {
      context.succeed('');
    }
  ```
  Upload it just like the previous Lambda functions:

  ![noop](https://cloud.githubusercontent.com/assets/12450298/12744540/be1404a0-c98c-11e5-8a7b-a0dfb74bc6f1.png)

6. Next go to the Amazon API Gateway console and create a new API by clicking 'Create API'. Give it a name, we've called our API 'SecureUsers':

  ![api gateway](https://cloud.githubusercontent.com/assets/12450298/12744749/cd30dd9a-c98d-11e5-97ce-217fe7adf74f.png)


### Testing Lambda Functions

#### Unit Testing

1. **Using Lambda to test Lambda!**

    This method uses Lambda itself as the test platform. This involves creating a “unit” test that calls the Lambda function being tested and then either summarizes whether it succeeded or failed and/or records its output in DynamoDB. AWS lambda has a 'unit and load test harness' blueprint that you can use to test another Lambda function when it is live on AWS. The harness has two modes: 'Unit' and 'Load' so simple scale testing can also be performed.

    More information and an example can be found [here](https://aws.amazon.com/blogs/compute/serverless-testing-with-aws-lambda/)

2. **Generating mock events and testing locally using a Node.js assertion library**

    The event and context objects can be mocked so that the lambda function can be tested locally before deployment. Using the 'Test' function in the AWS Lambda console it is possible to view the format of different event objects e.g. DynamoDB events, SNS notifications,

    Have a look at [mock-events.js](www.github.com/dwyl/learn-aws-lambda/lambda-testing/mock-events.js) to see some examples. These can be used to create helper functions to generate mock events.

    The context object has the following form:

    ```js
    {
    //methods
    success,
    done,
    fail,
    getRemainingTimeInMillis,

    //properties
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
        Custom,
      },
      env: {
        platform_version
        platform,
        make,
        model,
        locale,
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
      context.succeed(event.key1);  // SUCCESS with message
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
  }

  var response = null
  var error = null;

  test("Capture response", t => {
    lambdaToTest.handler(testEvent, ctx);
    //capture the response or errors
    ctx.Promise
      .then(resp => {
        response = resp;
        t.end();
      })
      .catch(err => {
        error = err;
        t.end();
      })
  })

  test("Check response", t => {
    t.equals(response, 'name');
    t.end();
  })
  ```

  More info on testing lambda functions locally can be found  [here](https://medium.com/@AdamRNeary/developing-and-testing-amazon-lambda-functions-e590fac85df4#.romz6yjwv) and an example of testing by mocking the context object can be found [here](http://codedad.net/2016/01/03/test-aws-lambda-function-without-aws/).

3. **Using grunt-aws-lambda plugin**

    This plugin for Grunt has helpers for running Lambda functions locally as well as for packaging and deployment of Lambda functions.

    More info and an example can be found [here](https://aws.amazon.com/blogs/compute/continuous-integration-deployment-for-aws-lambda-functions-with-jenkins-and-grunt-part-1/)

### Trigger a Lambda function when an email is received by Amazon Simple Email Service

Start by creating a blank AWS Lambda function that will be called whenever a new email comes in.

#### Set up SES
For this you need your own domain, and you need to verify the domain with AWS, this can take up to 72hrs, so have a nice drink and chill out while you wait :sunglasses: :coffee:

	See here for how: http://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domain-procedure.html

#### Add a rule set
Click `rule sets` on the bottom left and create a new rule set with whatever name you like. If you want to have your function triggered by emails sent to any address in your domain you can leave recipient blank, else you can add the recipient you want to trigger the function.

In that rule set add an action for your Lambda function. This tells AWS to run your action when an email is received by SES.

This is all you need to do to make your function trigger from SES, but depending on what your Lambda function does, it might be kind of hard to verify that it's run (though you can look at the stats for the function to see how and when it's been run) so let's make it save the body of your email to your bucket!

### Warning before continuing

This next section is an illustration of how Lambda function can be used with SES, not a recommendation for usage.
If you set this up on your own AWS account, it's possible a SPAMer will _flood_ your Lambda and cause you to waste _loadz-a-money_ on S3 writes...

![image](https://user-images.githubusercontent.com/194400/28249477-7f486464-6a4e-11e7-983b-cc7735876ef2.png)
**$0.05 per 1,000** writes to S3 might not _sound_ like a lot, but it will add up if you consider the volume of spam sent/received. (_if you use GMail you won't realise it because Google has **amazing** filters, but an "un-protected" email address will get hundreds and a reasonably popular domain will get **thousands** of SPAM  emails **per day**_)

> Fun Fact: Over 50% of email is SPAM see: https://www.statista.com/statistics/420391/spam-email-traffic-share/
![image](https://user-images.githubusercontent.com/194400/28249544-a823d822-6a4f-11e7-9e21-791a9eba0aa6.png)

Continue with care :dollar:

#### Save the email to S3

Go back to the rule set you created for your Lambda function. Add a new action to it, this one should be an S3 action, with the bucket you want to use selected. This will save the email to S3. Make sure this action is positioned **above** your Lambda function:

![ses management console - google chrome_006](https://user-images.githubusercontent.com/22300773/28177094-a0e16bfc-67f1-11e7-8676-feabc437295f.png)

This saves the email in a slightly weird way that we don't have that much control over, so we want our Lambda function to take the file written from the S3 action and process it separately.

Before this can happen you need to set up a role to give your function access to S3, for the policy of the role put something like this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:us-east-2:YOUR-USER-ID-HERE:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "s3:*"
            ],
            "Resource": [
                "arn:aws:logs:us-east-2:271861816104:log-group:/aws/lambda/getHelloWorld:*",
                "arn:aws:s3:::YOUR-BUCKET-HERE",
                "arn:aws:s3:::YOUR-BUCKET-HERE/*"
            ]
        }
    ]
}
```

The `s3:*` property under `Action` allows all s3 functionality for any functions with this role. The last two properties under `Resource` give access to your bucket and any subdirectories within it.

In the permissions tab of your S3 bucket select "Any Authenticated AWS User" and give read and write access for object access and permission access.

(I'm sure there is a better way than this, __please__ raise an issue if you know how :pray:)

So now when we receive an email it is save to S3 and a function is triggered. Next we need we need to hook the two up so our Lambda function reads the saved file, and saves the body in a nice readable way.

#### Save the body to S3 using AWS Lambda
To do this we can change our Lambda function to look like this:

```js
var AWS = require('aws-sdk');
var s3 = new AWS.S3( {
    signatureVersion: 'v4'
} ); //Make a new instance of the AWS.S3 object, telling it which signature version to use


exports.handler = (event, context, callback) => {
    s3.getObject({ //get the saved object from your S3 bucket
        Bucket: YOUR-BUCKET-NAME-HERE,
        Key: 'YOUR-SUBDIRECTORY-THAT-S3-SAVES-TO/' + event.Records[0].ses.mail.messageId
    }, (err, res) => { //The contents of the file will be passed into the callback as res

        const params = {
            Bucket: BUCKET-YOU-WANT-TO-SAVE-TO,
            Key: FILE-NAME-YOU-WANT,
            Body: res.Body.toString() //res.Body is a buffer so you can call
						// "toString()" on it to make it into a string
        };

        s3.putObject(params, (err, res) => { //this will put the file you
						// specified in params in the bucket
            console.log(err, res); // you'll either get an error or response
						// depending on if the file was added to the bucket properly
            callback(null, 'Success!');
        })
    })


};
```

Check out the comments in the code to see what it does, and once you understand it, adapt it to your specific needs!

If you've put all this together, you should have an AWS set up where you can send an email to an address and the body of it is saved to a bucket!


### Continuous Integration using Codeship

After writing your tests, the next step is to set up Continuous Integration (CI) for your Lambda Functions so every time you push up your code to GitHub, the tests are run and the code is deployed to AWS if the tests pass. This example goes through how to set up CI using Codeship.

Some initial set up of your project repo is required. This involves having a lambda function file in the correct format (with an exports.handler function), and a data.json file with a test event. The flow will be as follows:

* Push code to GitHub
* This triggers Codeship
* Codeship runs the tests
* If tests pass, Codeship deploys Lambda function to AWS, else build fails
* Codeship invokes Lambda function on AWS with the test event to check live version is working as expected
* If successful, Codeship reports build succeeded!

**Follow along with this simple example to try out setting up the process yourself**

1. Create a FREE account on [Codeship](https://codeship.com/) and connect to your GitHub account

2. Fork this repo on Github!

3. Create a project in Codeship connecting to your forked repo.

  If you have any problems with the Step 1 or 3, follow the instructions on the [Codeship documentation]().

4. Create a hello-world Lambda function on AWS following the steps in [this earlier section](#hello-world-example-inline). In the 'Configuration' tab **Make sure that the name of the handler is changed from 'index.handler' to 'LambdaTest.handler'. 'LambdaTest' will be the name of the zip file that we upload to AWS through Codeship.**

  Also make a note of the ARN for the lambda function - it can be found in the top right hand corner of the page. It should have the form: `arn:aws:lambda:YOUR_AWS_REGION:YOUR_AWS_ACCOUNT_ID:function:YOUR_FUNCTION_NAME`. You'll need it when setting up the Deployment Script on Codeship.

  ![Lambda arn](https://cloud.githubusercontent.com/assets/5912647/12617272/de1cc1b8-c506-11e5-98e4-1dc8692450e0.png)

5. Create a User for Codeship in AWS and get an AWS 'access key' and 'access secret key'.

  We need to give Codeship access to the lambda function on AWS so it can update and invoke the function. AWS IAM best practices suggest creating a Group with an access policy to which Users can be added.

  Navigate to the 'Identity and Access Management' section of the AWS console.

  ![IAM dashboard](https://cloud.githubusercontent.com/assets/5912647/12616879/1815056c-c505-11e5-90b9-81ae434c1ed3.png)

  Select the 'Users' tab from the left hand menu. Click the blue 'Create New Users' button. Give the first user the name 'Codeship' (We've already done this!). Make sure the 'Generate an access key for each user' checkbox is ticked. Then click 'Create'.

  ![create user button](https://cloud.githubusercontent.com/assets/5912647/12617062/f75caa9a-c505-11e5-9ff9-551df7aa8f38.png)

  ![new user](https://cloud.githubusercontent.com/assets/5912647/12617077/07b7bdee-c506-11e5-941f-a35ae14e2bdc.png)

  On the next screen, click the 'Show User Security Credentials' arrow. It will show you an 'access key' and 'access secret key' for this user. **Copy the keys and paste them somewhere safe. You won't be shown them again**.

  Next select the 'Groups' tab in the left hand pane. Click the blue 'Create Group' button.

  ![Create Group button](https://cloud.githubusercontent.com/assets/5912647/12617139/3a2d249e-c506-11e5-898a-b3f9307e0da2.png)

  Give the group the name 'CI' or any name of your choice. In the next page under 'Attach Policy', just click 'Next Step'. We will be adding our own custom policy.

  Navigate back to the Groups tab and click on your newly created group. Select the 'Users' tab and click on the blue 'Add Users to this Group' button. You can then add the user we just created.

  To give Codeship access to update, invoke and retrieve your AWS Lambda function, you need to add an access policy. Select the tab 'Permissions' and then click on 'Inline Policy' > 'Create new one'.

  ![Add a policy](https://cloud.githubusercontent.com/assets/5912647/12618166/a88dee74-c50a-11e5-8668-cec9a9430782.png)

  Select the 'Custom Policy' option and click 'Select'.

  ![Create policy](https://cloud.githubusercontent.com/assets/5912647/12618996/21f8c876-c50e-11e5-9c5b-668a5c56a3df.png)

  In the 'Policy Name' field add 'Codeship Policy' and in the 'Policy Document' add in the following text:

  ```js
    {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "lambda:UpdateFunctionCode",
                  "lambda:UpdateFunctionConfiguration",
                  "lambda:InvokeFunction",
                  "lambda:GetFunction",
                  "lambda:CreateFunction",
              ],
              "Resource": [
                "YOUR_LAMBDA_FUNCTION_ARN_HERE"
              ]
          }
      ]
  }
  ```

  Then click 'Validate Policy' and if the validation is successful, click 'Create Policy'.

6. Add the AWS User Environment variables to your Codeship project. In the Environment tab in Codeship, add your 'AWS_ACCESS_KEY', 'AWS_SECRET_ACCESS_KEY' and 'AWS_DEFAULT_REGION' (usually 'us-east-1'). This is needed in order to authorise the Codeship to execute commands from the aws cli.

  ![Environment variables](https://user-images.githubusercontent.com/5222954/32383573-bdf7ad6e-c08e-11e7-938a-0ab81f78e830.png)

7. Set up Test and Deployment Scripts for your Codeship project

  Click the the Test tab in your project settings.

  ![Setup Commands](https://user-images.githubusercontent.com/5222954/32383449-63517944-c08e-11e7-860f-aa7740806db3.png)

  You should already see the follow default code:

  ```bash
  # We support all major Node.js versions. Please see our documentation for a full list.
  # https://documentation.codeship.com/basic/languages-frameworks/nodejs/
  #
  # By default we use the Node.js version specified in your package.json file and fall
  # back to the latest version from the 0.10 release branch.
  #
  # You can use nvm to install any Node.js version you require
  #nvm install 0.10
  nvm install 0.10
  ```

  We're using tape to run the tests so it also needs to be installed globally on the virtual machine. Add this line in at the end:

  ```bash
  npm install -g tape
  npm install
  ```

  AWS Lambda [*used to*](https://twitter.com/nelsonic/status/718377061090516992) only support Node 0.10 so our tests (which are written in es6) are piped through babel so that they could be run without Node 4.0. However this would be no longer required.

  Under 'Configure Test Pipelines', in the 'Test Commands' tab add `npm test`.

  In the Deployment Tab, under 'Configure Deployment Pipeline' select the name of the branch on GitHub that you want to test.

  ![Deployment pipeline](https://user-images.githubusercontent.com/5222954/32383445-63162b50-c08e-11e7-8bed-02445e4dcce8.png)

   Then choose the 'Custom Script' option.

   ![Custom script](https://user-images.githubusercontent.com/5222954/32383447-63366f32-c08e-11e7-9d96-df1cfde52633.png)

   This next page looks like this. We will add our own script to the deployment commands.

   ![depoyment script](https://user-images.githubusercontent.com/5222954/32383446-632751aa-c08e-11e7-8f40-297281156e74.png)

  We're going to first zip up the lambda function, then use the AWS cli to update the version on AWS, and finally invoke it with a test event. Add in the following code to the deployment commands:

  ```bash
  pip install awscli
  zip -r LambdaTest.zip -j lambda-testing/functions/LambdaTest.js
  aws lambda update-function-code --function-name LambdaTest --zip-file fileb://LambdaTest.zip
  aws lambda get-function --function-name YOUR_LAMBDA_FUNCTION_ARN_HERE
  aws lambda invoke --function-name YOUR_LAMBDA_FUNCTION_ARN_HERE --payload file://lambda-testing/tests/data.json --log-type Tail lambda_output.txt
  cat lambda_output.txt
  ```

8. Make a change and push up to GitHub! Try modifying the LamdaTest.js file and/or the data.json file, commit the change and push the code up to GitHub. This should trigger Codeship.  View the build log to make sure the build is successful and the test passes.

  ![Codeship build log](https://user-images.githubusercontent.com/5222954/32383448-634406ce-c08e-11e7-9697-5a66ceed3c5c.png)

  Also have a look at the monitoring tab in your Lambda function console. You should see a spike where the function was invoked by Codeship.

  ![AWS monitoring log](https://cloud.githubusercontent.com/assets/5912647/12619412/cb2df10e-c50f-11e5-8af3-d53c11d4953b.png)

For more information have at the Codeship documentation:
* [Integrating AWS Lambda with Codeship](https://blog.codeship.com/integrating-aws-lambda-with-codeship/)
* [Deployment to AWS Lambda](https://documentation.codeship.com/basic/continuous-deployment/deployment-to-aws-lambda/)

### Upload Your Lambda Function to an S3 Bucket and Automatically Deploy it to Lambda (bash script example)
In this example will build a script that will execute the neccessary steps to upload a Lambda function to S3 where it can be stored and then automatically deploy it to Lambda.

We will be writing our own bash script that will involve the use of some of the AWS CLI commands. Follow these instructions on how to get set up with the AWS CLI on your local machine:

1. If you haven't already done so, set up an account with AWS **[here](http://aws.amazon.com/)**.

2. You'll then need to get your 'access key ID' and 'secret access key' by doing the following:
    * Open the IAM console
    * In the navigation pane choose 'Users'
    * Click your IAM username
    * Click 'Security Credentials' and then 'Create Access Key'
    * To see your access key, choose Show User Security Credentials. Your credentials will look something like this:
        * Access Key ID: AKIAIOSFODNN7EXAMPLE
        * Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    * Click 'Download Credentials' and store them in a secure location

3. Install the AWS CLI via a method of your choice **[here](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)**.

4. Once it's installed you have to configure it. Type ```aws configure``` in the command line. You should see something like this:
  ```bash
  $ aws configure
  AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
  AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  Default region name [None]: eu-west-1
  Default output format [None]: ENTER
  ```
  Enter your aws access key, secret access key and region then press enter on the last option.  
  You should now be good to go!

5. Next write a Lambda function in your text editor if you haven't already. Check out our **[previous example](https://github.com/dwyl/learn-aws-lambda#hello-world-example-zip)** up until step 4 _(we'll be automating the zipping in this example)_.  

6. Once you've done this you'll want to create a new S3 bucket that will store all of your uploaded Lambda functions. Click on the S3 console on the AWS Management Console window:

 ![s3 console](https://cloud.githubusercontent.com/assets/12450298/12646827/32f97802-c5ca-11e5-84a8-b49e2cd0e929.png)

 Click the 'Create Bucket' button. Give your S3 Bucket a name and select its region. We've called ours 'lambda-function-container':

  ![s3 create bucket](https://cloud.githubusercontent.com/assets/12450298/12646889/8f342590-c5ca-11e5-8e2f-e2cb2bccf04d.png)

7. Next you'll want to write a bash script that will perform 3 commands. The first is to create your deployment package (a .ZIP file containing your lambda function and its dependencies). The second will upload the deployment package to your newly created S3 Bucket. The third will deploy your Lambda function from S3.

  To do so create a new file and call it whatever you want and save it as a ```.sh``` file. We've called ours 'lambda-upload-create.sh'. The 3 commands require variables as input which is why we've included the ```echo``` & ```read``` bash commands in order to temporarily save these inputs:

  ![echo and read](https://cloud.githubusercontent.com/assets/12450298/12647320/7f9fdd52-c5cc-11e5-98d0-dfd68b6a8caf.png)

  We tried to have as few variable inputs as possible so that it reduces the margin for error when typing it into the command line. These are followed by our zip and AWS CLI commands:

  The first command (zip) takes two inputs, the name of the zip file you want to create and the names of the files you want to zip up. _(in our case its going to be upload and upload.js seeing as we have no dependencies)_
  ```bash
  zip -r "$ZipFileName.zip" $FilesToBeZipped
  ```

  The upload command 'put-object' takes three inputs, the name of the bucket, the key which is the file path of the zip file and the body which is the same as the key in this case.
  ```bash
  aws s3api put-object --bucket $BucketName --key "./$ZipFileName.zip" --body "./$ZipFileName.zip"
  ```

  The deployment command 'create-function' takes five inputs, the function name which can be anything you like, the runtime which in our case is nodejs, the role which is the ARN for an IAM role you have used/created in the IAM console, the code which consists of the bucket name that you're deploying from and the key which is the file path of the zip and finally the description of your function which is optional.
  ```bash
  aws lambda create-function --function-name $FunctionName --runtime nodejs \
  --role $Role --handler "$ZipFileName.handler" \
  --code S3Bucket="$BucketName",S3Key="./$ZipFileName.zip" \
  --description $Description
  ```
8. Let's create the script that we'll run in our ```package.json``` that will trigger the ```.sh``` file we just created:

  ![script link](https://cloud.githubusercontent.com/assets/12450298/12648830/b1af1d4c-c5d3-11e5-91af-0d32691b7764.png)

  In order to be able to run our script we have to make it **_executable_**. Type this command into your terminal:

  ```chmod +x (filenameOfScript.sh)```

9. One final step before we'll be able to run our script. Go back to AWS and go to the IAM console because you need to add some   policies that enable you to perform certain methods like 'create-function' or 'put-object'.

  Click on the groups and then select 'Create Group'. We've made a 'Public' group, click on it once you've created it:
  ![create group](https://cloud.githubusercontent.com/assets/12450298/12649316/06ac3a80-c5d6-11e5-8b05-d624d507a12e.png)

  Click on the 'Attach Policy' button and then select 'IAMFullAccess' from the list:
  ![Attach policy](https://cloud.githubusercontent.com/assets/12450298/12649326/11a19a3e-c5d6-11e5-82e3-5136640fdeb4.png)

  Click on the 'Create Group Policy' in the Inline Policies section:
  ![inline policy](https://cloud.githubusercontent.com/assets/12450298/12649339/1c916cb2-c5d6-11e5-8109-34f51f860d5a.png)

  Select the 'Custom Policy' and then press the 'Select' button:
  ![custom policy](https://cloud.githubusercontent.com/assets/12450298/12649566/095d28ba-c5d7-11e5-812d-97ea278cb285.png)

  Create your custom policy. We've included the necessary effects, actions and resources to have complete access. Then click 'Apply Policy':
  ![create custom policy](https://cloud.githubusercontent.com/assets/12450298/12649574/0f1dbcd8-c5d7-11e5-864e-d9e04b80882f.png)

  Once your group has been created you'll need to add a user to it. Any user who is added to that group will have the same permissions. If you haven't created a user you can do that here:
  ![create user](https://cloud.githubusercontent.com/assets/12450298/12649893/73b3e590-c5d8-11e5-9cec-88bee1ac5c4d.png)

  Go back to the group you just created and then click 'Add Users to Group' and then select a user to add. The user should be the one that has the access key id and secret access key assigned to it that you're using for the AWS CLI.
  ![add users](https://cloud.githubusercontent.com/assets/12450298/12650158/9c0df796-c5d9-11e5-91da-dc4f45d22c98.png)

  We should now be able to take our script for a spin!

10. In the command line, run the script in your ```package.json```. Ours is as follows:
  ```$ npm run upload```

  This should prompt the ```echo``` and ```read``` commands first:
  ```bash
  Enter the name of the files you wish to zip (eg. lambdaFunction.js node_modules): upload.js
  Enter the name of the output zip file (eg. lambdaFunction): upload
  Enter the name of the s3 bucket you wish to upload to: lambda-function-container
  Enter the name of your lambda function: Upload
  Enter the ARN of the role you wish to implement: arn:aws:iam::655240711487:role/lambda_basic_execution
  ```

  After you've hit enter it should return this:
  ```bash
  adding: upload.js (deflated 17%)
  {
      "ETag": "\"519e9cfc9a2ee33412ba813c82f33a56fa3\""
    }
  {
    "CodeSha256": "nbYYHfHKyYSlb09Dpw7vf7wB93F+9V8XEmaTBU=",
    "FunctionName": "Upload",
    "CodeSize": 249,
    "MemorySize": 128,
    "FunctionArn": "arn:aws:lambda:eu-west-1:655240711487:function:Upload",
    "Version": "$LATEST",
    "Role": "arn:aws:iam::655240711487:role/lambda_basic_execution",
    "Timeout": 3,
    "LastModified": "2016-01-28T13:31:28.627+0000",
    "Handler": "upload.handler",
    "Runtime": "nodejs",
    "Description": "Bash Script Tutorial"
  }
  ```

11. Go to S3 to check if the deployment package has been uploaded. You should see your ```.ZIP``` file:

  ![s3 uploaded](https://cloud.githubusercontent.com/assets/12450298/12650714/bcb0664e-c5db-11e5-9d08-a2bf2f2c32ff.png)

12. Go to Lambda to check if your Lambda function has been enabled:

  ![lambda enabled](https://cloud.githubusercontent.com/assets/12450298/12650757/ee4b886e-c5db-11e5-8505-08b3b4bc0958.png)

  That's all! You should now be able to upload and deploy a Lambda function with a single bash script.

### Deploying Lambda Functions using Gulp

  [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/API.md) can be used to automate the zipping, deployment and testing of Lambda functions on AWS. The Codeship deployment script can then be reduced to a single command `gulp deploy`!

  The syntax to create a new Gulp task is:

  ```js
  gulp.task('name of task', function() {
    return  //gulp functions to run
  })
  ```

  There many plugins for performing actions like retrieving, moving and zipping files. These actions are also chainable.

  We will go through a simple gulp script with tasks for each of the steps involved.

1. Require in all the relevant modules and files. We'll be using the aws-sdk to deploy and invoke the lambda function. We also need to read in the `package.json` file in order to add the node modules to the zip file.

    ```js
    var AWS         = require('aws-sdk');
    var gulp        = require('gulp');
    var zip         = require('gulp-zip');
    var install     = require('gulp-install');
    var runSequence = require('run-sequence');
    var fs          = require('fs');

    var packageJson = require('./package.json');
    ```

 2. Declare Constants.
    ```js
    var region       = 'eu-west-1';  //AWS region
    var functionName = 'LambdaTest';  
    var outputName   = 'LambdaTest.zip'; //name to be given to output zip file

    // the ARN of the execution role to be given to the lambda function - change this to a role from your account
    var IAMRole = 'arn:aws:iam::685330956565:role/lambda_basic_execution';

    // the paths of the files to be added to the zip folder
    var filesToPack = ['./lambda-testing/functions/LambdaTest.js'];
    ```

    **Make sure the IAM role is changed to the ARN of a role from your AWS account and the region is set to the AWS region you want to deploy the Lambda function to!**

3. Create an archive folder and add the project files

    ```js
    gulp.task('js', function () {
      return gulp.src(filesToPack, {base: './lambda-testing/functions'})
        .pipe(gulp.dest('dist/'));
    });
   ```

    `gulp.src` takes an array of file paths as the first argument and an options object as the second. If you specify a base file path in the options only the folders/files after the base are copied i.e. in this case, only the LambdaTest.js file is copied into the archive folder (`dist`).  

4. Add the node modules to the archive folder

    ```js
    gulp.task('node-modules', function () {
      return gulp.src('./package.json')
        .pipe(gulp.dest('dist/'))
        .pipe(install({production: true}));
    });
    ```

    In this task, the `package.json` file is copied to the archive folder and the 'gulp-install' module is used to do an `npm install --production` of all the listed dependencies.

5. Zip up the archive folder and save it.

    ```js
    gulp.task('zip', function () {
      return gulp.src(['dist/**', '!dist/package.json'])
        .pipe(zip(outputName))
        .pipe(gulp.dest('./'));
    });
    ```

    All the files in the dist folder apart from the `package.json` file are zipped up using the 'gulp-zip' module and save in the root of the project folder.

6. Upload the zip file to AWS. If the function already exists, update it, otherwise create a new Function.

    We can create an 'upload' task with gulp:

    ```js
    gulp.task('upload', function() {})
    ```

    Inside the function we first have to do a bit of set up:

    ```js
    AWS.config.region = region; // this is set to eu-west-1 from the constants declared in step 1
    var lambda = new AWS.Lambda();
    var zipFile = './' + outputName; // the outputName has also been set in step 1
    ```

    First we need to check if the function already exists on AWS before deciding whether to create a function or update a function.

    ```js
    lambda.getFunction({ FunctionName: functionName }, function(err, data) {
      if (err) createFunction();
      else updateFunction();
    });
   ```

    We also need a function to retrieve the saved zip file in order to pass it in as a parameter in our create function command.

    ```js
    function getZipFile (callback) {
      fs.readFile(zipFile, function (err, data) {
            if (err) console.log(err);
            else {
              callback(data);
            }
      });
    }
    ```
 
    The `getZipFile` function takes a callback which gets called with the file data if the file is read successfully.

    Using the aws-sdk we can then define a function to create a new Lambda function from this zip file.

    ```js
    function createFunction () {

      getZipFile(function (data) {
        var params = {
          Code: {
            ZipFile: data // buffer with the zip file data
          },
          FunctionName: functionName, // functionName was set in the constants in step 1
          Handler: 'LambdaTest.handler',  // need to set this as the name of our lambda function file is LambdaTest.js
          Role: IAMRole,  // IAMRole was set in the constants in step 1
          Runtime: 'nodejs'
        };

        lambda.createFunction (params, function (err, data) {
          if (err) console.error(err);
          else console.log('Function ' + functionName + ' has been created.');
        });
      });

    }
    ```
    Similarly we can also define `updateFunction`:

    ```js
    function updateFunction () {

      getZipFile(function (data) {
        var params = {
          FunctionName: functionName,
          ZipFile: data
        };

        lambda.updateFunctionCode(params, function(err, data) {
          if (err) console.error(err);
          else console.log('Function ' + functionName + ' has been updated.');
        });
      });
    }
    ```

7. Invoke the function with a test event to check the live version is working as expected.

    We have to first get the function to make sure it exists and only invoke it if there isn't an error.

    In the parameters for invoking the function, a JSON object can be specified as the 'Payload' and the 'InvocationType' can be specified as 'RequestResponse' if you want to get a response body.

    ```js
    gulp.task('test-invoke', function() {
      var lambda = new AWS.Lambda();

      var params = {
        FunctionName: functionName,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: '{ "key1" : "name" }'
      };

      lambda.getFunction({ FunctionName: functionName }, function(err, data) {
        if (err) console.log("Function" + functionName +  "not found", err);
        else invokeFunction();
      });

      function invokeFunction() {
        lambda.invoke(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
        })
      }
    })
    ```

8. Create a deployment task that runs all the above tasks in series in the correct order.

    The `runSequence` module takes a comma separated list of gulp task names or a list of arrays with gulp tasks, and ends with a callback. The tasks are run in the order they are specified. To run two tasks in parallel specify them in the same array.

    ```js
    gulp.task('deploy', function (callback) {
      return runSequence(
        ['js', 'node-modules'],
        ['zip'],
        ['upload'],
        ['test-invoke'],
        callback
      );
    });
    ```

    **In the AWS console you can only view functions by region, so if you can't see the function after it has been created, check you're looking at the correct region (in the dropdown menu in the top right of the console)**

    ![AWSregion](https://cloud.githubusercontent.com/assets/5912647/12677661/75d12846-c692-11e5-878d-990487be9910.png)

9. Add the deployment script to Codeship or your package.json

    In Codeship just add `gulp-deploy` to your Deployment script and you're good to go!

    **Note: Make sure the Access Policy of the Codeship User in the IAM console on AWS has permissions for all the actions you're trying to execute. i.e. getting, creating, updating and invoking lambda functions.**

#### Upload to S3 and Deploy to Lambda With Gulp
Here we will implement the previous example of uploading a Lambda function to S3 and then deploying it from the bucket. Intead of using a bash script we can use Gulp. We can make some small adjustments to the Gulp example that we just created in order to deploy from S3. This is a continuation from that so please check it out before you look at this one:

1. We're going to want to create a new Gulp task that will upload our zip file. We've called our task 'upload-to-s3' and we've included it just after our zip task.

    The first thing we do is create a new S3 instance using the AWS SDK because we'll need to access some S3 methods. We then declare the path of the zip file we want to upload to be used as the S3 Key. We then created a 'getZipFile' function that will get the 'Body' for the parameters and also wrap around the 'putObject' method. We then write the S3 method which takes params _(an object with 'Bucket', 'Key' and 'Body' within it)_ and a callback that handles errors is called when a response from the service is returned.
    ```JavaScript
    gulp.task('upload-to-s3', function () {
      var s3 = new AWS.S3();
      var zipFilePath = './' + outputName;
      getZipFile(function (data) {
        var params = {
          Bucket: 'lambda-function-container',
          Key: zipFilePath,
          Body: data
        };
        s3.putObject(params, function(err, data) {
          if (err) console.log('Object upload unsuccessful!');
          else console.log('Object ' + outputName + ' was uploaded!');
        });
      });
      function getZipFile (next) {
        fs.readFile(zipFilePath, function (err, data) {
              if (err) console.log(err);
              else {
                next(data);
              }
        });
      }
    });
    ```
2. Next we need to add our new task to the list of tasks in our runSequence that we've already created. We want it to come after zipping but before our 'upload' task:
    ```JavaScript
    gulp.task('deploy', function (callback) {
      return runSequence(
        ['js', 'node-mods'],
        ['zip'],
        ['upload-to-s3'],
        ['upload'],
        ['test-invoke']
        callback
      );
    });
    ```

3. In order for our Lambda function to be deployed from S3, we're going to have to adjust our 'createFunction' & 'updateFunction' Lambda methods that we created previously.

    We needed to change the 'Code' parameter from ```ZipFile: data``` to:
    ```JavaScript
    function createFunction () {
        var params = {
          Code: {
            S3Bucket: bucketName,
            S3Key: zipFile
          },
          FunctionName: functionName,
          Handler: 'LambdaTest.handler',
          Role: IAMRole,
          Runtime: 'nodejs'
        };

        lambda.createFunction (params, function (err, data) {
          if (err) console.error("CREATE ERROR", err);
          else console.log('Function ' + functionName + ' has been created.');
        });

    }
    ```
    We then needed to do the same with our 'updateFunction':
    ```JavaScript
    function updateFunction () {
        var params = {
          FunctionName: functionName,
          S3Bucket: bucketName,
          S3Key: zipFile
        };

        lambda.updateFunctionCode(params, function(err, data) {
          if (err) console.error(err);
          else console.log('Function ' + functionName + ' has been updated.');
        });
    }
    ```
4. Because we added some more AWS methods, we'll need to update our policy so that it supports this. Go to your IAM console and add the necessary methods. Here's ours:

    ![policy](https://cloud.githubusercontent.com/assets/12450298/12679928/e3ee941a-c69e-11e5-9e39-4ea1dcf95fda.png)
    We included a 'getObject' method to check if the object had been uploaded already.
    ```JavaScript
    function checkObject (fn) {
      var params = {
        Bucket: bucketName,
        Key: zipFile
      };
      s3.getObject(params, function (err, data) {
        if (err) console.log('BUCKET ERROR', err);
        else fn();
      });
    }
    ```
5. Your script should be good to go! Once you've run it go to your S3 and Lambda consoles to check if your Lambda function has been uploaded and deployed:

  ![uploaded](https://cloud.githubusercontent.com/assets/12450298/12680122/0be2f64a-c6a0-11e5-91e4-c452adf3e766.png)

  ![deployed](https://cloud.githubusercontent.com/assets/12450298/12680144/2241d87a-c6a0-11e5-8e15-2c5fc32e3470.png)


#### Deploy your Lambda functions using the deployment module we wrote - `npm dpl`

We decided to write `dpl` to make deploying your Lambda functions _extremely_ easy. Here's how to implement it.

1. `$ npm install dpl --save-dev`
2. Configure your environment variables.
    You need `AWS_REGION` and `AWS_IAM_ROLE`  
    ```
    export AWS_REGION=eu-west-1
    export AWS_IAM_ROLE=arn:aws:iam::123456789:role/LambdaExecRole
    ```
3. Add the _list_ of files to deploy to your `package.json`:
    ```json
    "files_to_deploy": [ "package.json", "index.js", "lib/" ]
    ```
4. Add the deployment script to your `package.json`
    ```json
    "scripts": {
        "deploy": "dpl"
    }
    ```
5. Run the script
    ```
    $ npm run deploy
    ```

### Versioning and Aliasing Lambda Functions

Multiple versions of a Lambda function can be running at the same time on AWS. Each one has a unique ARN. This allows different versions to be used in different stages of the development workflow e.g. development, beta, staging, production etc. Versions are immutable.

An alias is a pointer to a specific Lambda function version. Aliases are however mutable and can be changed to point to different versions. For example you might have two aliases 'DEV' and 'PROD', standing for 'development' and 'production' respectively. Event sources such as S3 buckets, DynamoDB tables or SNS topics can be configured with a Lambda function alias so that the ARN of the specific version doesn't need to be updated every time in the event source mapping. When new versions are upgraded to production, only the alias needs to be changed and the event source will automatically point to the correct version. This workflow also enables easy rollbacks to previous versions.

#### Versioning

When you create a Lambda function e.g. 'helloworld', its version is automatically set to `$LATEST`. The version is the last part of the Lambda function's ARN:
```bash
arn:aws:lambda:aws-region:acct-id:function:helloworld:$LATEST
```
The `$LATEST` version is mutable i.e. if a Lambda function is updated either in the console or using the cli, the code in the `$LATEST` version is updated.

You can also _publish_ a new version from the `$LATEST` version. The ARN of the published version will have the version number replaced: e.g. for Version 1:
```bash
arn:aws:lambda:aws-region:acct-id:function:helloworld:1
```
Published versions are immutable so if you want to change any part of the code or configuration, you have to modify `$LATEST` and then publish a new version.
If the `$LATEST` version is not changed, then a new version cannot be published.

#### Aliasing

An alias can be created for an existing Lambda function. The alias and lambda function have different ARNS as they are both unique AWS resources.

Using aliases means that calling event source doesn't have to know the specific Lambda function version the alias is pointing to.  It enables
* new versions to easily be promoted or rolled back (aliases can easily be mapped to different function versions)
* easier event source mappings - more control over which versions of your function are used with specific event sources in your development environment

Walkthrough of implementing [versioning](http://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases-walkthrough1.html) and [aliasing](http://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases-walkthrough1.html) using the AWS CLI on the AWS Lambda docs.

### Create an API with GET/POST Methods that uses Lambda functions to retrieve/update records from a DynamoDB table

1. First we'll need to create a table in DynamoDB. Go to the DynamoDB console and then click the 'Create Table' button. Give your table a name _(call it something relevant to the type of data your DynamoDB table will hold)_. We've called ours 'Users'. The 'Primary key' is made up of a 'Partition key' _(hash key)_ and an optional 'Sort key'. _(The partition key is used to partition data across hosts for scalability and availability)_:


    ![create table](https://cloud.githubusercontent.com/assets/5912647/12557398/7114929c-c382-11e5-9c48-5c2bf15649ac.png)

    ![table name](https://cloud.githubusercontent.com/assets/12450298/12714300/c9a4e152-c8cb-11e5-8c35-370393cef70e.png)

    For 'Table settings' just check the 'Use default settings' checkbox and then click the blue 'Create' button:

    ![table setup](https://cloud.githubusercontent.com/assets/12450298/12714466/db3a51d0-c8cc-11e5-882f-a3b09df203a4.png)

2. Once the table is created, click on the 'Alarms' tab and then delete the basic alarms if they have been created:

    ![alarms](https://cloud.githubusercontent.com/assets/12450298/12714608/9da7b6ea-c8cd-11e5-8b5c-f09f94d3e66a.png)

    Then click on the 'Capacity' tab and then specify the 'Read' and 'Write' capacity units as 3 each and then click 'Save':

    ![capacity](https://cloud.githubusercontent.com/assets/12450298/12714552/5fe19b1e-c8cd-11e5-919a-780c3bb06316.png)

3. Next we will have to create a policy that allows your AWS functions to access Cloudwatch logs as well as the table you just created. Go to the IAM console, select 'Roles' and then 'Create new role'. We've called ours 'APIGatewayLambdaExecRole':

    ![create role](https://cloud.githubusercontent.com/assets/12450298/12714889/11c25804-c8cf-11e5-8b32-e01f9673b8cf.png)

    Select the 'AWS Lambda' role:

    ![lambda role](https://cloud.githubusercontent.com/assets/12450298/12714963/651140f6-c8cf-11e5-87f5-f547605f757a.png)

    And then click 'Next step' to skip the 'Attach Policy' section:

    ![skip attach policy](https://cloud.githubusercontent.com/assets/12450298/12714986/8de42822-c8cf-11e5-9fc8-9aad5ed4b799.png)

    In the 'Review' section click the blue 'Create Role' button to finish:

    ![review role](https://cloud.githubusercontent.com/assets/12450298/12715013/bcb3bc1c-c8cf-11e5-8fce-37f32546d0b5.png)

    Click on the title of the role you just created then click the down arrow for 'Inline Policies'. Follow the link to create an inline policy:

    ![inline policies](https://cloud.githubusercontent.com/assets/12450298/12715091/385b678e-c8d0-11e5-8006-1d65487b933e.png)

    Click on the 'Custom Policy' radio button and then click 'Select':

    ![custom policy](https://cloud.githubusercontent.com/assets/12450298/12715150/857ad6e4-c8d0-11e5-9688-c6237746e742.png)

    Give your custom policy a name _(we've called ours 'LogAndDynamoDBAccess')_ and then enter the following in the 'Policy Document' section. **Make sure your "Resource" at the bottom is set to the ARN of your table and the second "SID" is set to "_YourTableName_DynamoDBReadWrite"**. _(the ARN can be found in your 'Table details' by going to your DynamoDB console and clicking on your table.)_:

    ```
   {
     "Version": "2012-10-17",
     "Statement": [
         {
             "Sid": "AccessCloudwatchLogs",
             "Action": [
                 "logs:*"
             ],
             "Effect": "Allow",
             "Resource": "arn:aws:logs:*:*:*"
         },
         {
             "Sid": "UsersDynamoDBReadWrite",
             "Effect": "Allow",
             "Action": [
                 "dynamodb:DeleteItem",
                 "dynamodb:GetItem",
                 "dynamodb:PutItem",
                 "dynamodb:UpdateItem"
             ],
             "Resource": [
                 "arn:aws:dynamodb:eu-west-1:655240720487:table/Users"
             ]
         }
     ]
   }
    ```

4. Now we need to create the Lambda functions for adding and retrieving data to and from the table _(we'll be creating our functions in a text editor, zipping them up and then uploading them to Lambda. Follow the instructions in the previous 'HELLO WORLD!' .zip example on how to do this)_:

    Create a new ```.js``` file that will contain our first Lambda function. This function will GET information from the DynamoDB table. We've called the file ```getUserInfo.js```. Here is the code:

    ```JavaScript
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
    ```
    Zip up the file and then upload it to Lambda:
    ```
    zip -r getUserInfo.zip getUserInfo.js
    ```

   ![getuserinfo](https://cloud.githubusercontent.com/assets/12450298/12716616/ceb37a6a-c8d9-11e5-80be-54ebf8b9754d.png)

   For the Role, select the one we created earlier. Then click 'Next' and then 'Create function':

   ![role](https://cloud.githubusercontent.com/assets/12450298/12716846/6d4dcd82-c8db-11e5-9b01-3dccc12d8fa5.png)

   Click 'Test' to test the function. The results should return an empty objext ```{}```.

   Create a second ```.js``` file that will contain our second Lambda function. This function will UPDATE information in our DynamoDB table. We've called the file ```updateUserInfo.js```. Here is the code:

    ```JavaScript
    var AWS = require('aws-sdk');
    var DOC = require('dynamodb-doc');
    var dynamo = new DOC.DynamoDB();

    exports.handler = function(event, context) {
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
    ```
    Again zip up the file and then upload it to Lambda:
    ```
    zip -r updateUserInfo.zip updateUserInfo.js
    ```

    Follow the same steps as the previous function to create the second one, giving it the same role. They should both now appear in your functions section:

    ![functions](https://cloud.githubusercontent.com/assets/12450298/12717241/7e1805bc-c8de-11e5-9c0c-9974a961cef7.png)

    Test the function with a sample event relevant to your data. We created the following sample event:
    ```
    {
     "users": [
               {
                 "id": 1,
                 "name": "John Smith",
                 "location": "London"

               }
              ]
    }
    ```
    You should see an empty obect just like the first function ```{}```.
    Go back to the GetUserInfo function and then click 'Test' again. You should now see a returned result with the object in your sample event like this:

    ```
    [
     {
       "id": 1,
       "location": "London",
       "name": "John Smith"
     }
    ]
    ```

5. We're going to have to create one more Lambda function. It essentially does nothing but it is required by the OPTIONS method for CORS _(Cross Origin Resource Sharing which is a mechanism that allows restricted resources on a web page to be requested from )_. The function is as follows:

    ```JavaScript
      exports.handler = function(event, context) {
        context.succeed('');
      }
    ```
    Upload it just like the previous Lambda functions:

    ![noop](https://cloud.githubusercontent.com/assets/12450298/12744540/be1404a0-c98c-11e5-8a7b-a0dfb74bc6f1.png)

 6. Next go to the Amazon API Gateway console and create a new API by clicking 'Create API'. Give it a name, we've called our API 'SecureUsers':

    ![api gateway](https://cloud.githubusercontent.com/assets/12450298/12744749/cd30dd9a-c98d-11e5-97ce-217fe7adf74f.png)

    Click on the 'Create Resource' button and then give your resource a name. We've called ours 'Users':

    ![create resource button](https://cloud.githubusercontent.com/assets/12450298/12849024/2d7ae61c-cc15-11e5-8e92-1cefb9cc7bee.png)

    Click 'Create Resource' again to confirm it:

    ![create resource config](https://cloud.githubusercontent.com/assets/12450298/12849056/5e7c7082-cc15-11e5-87cc-51d921af1bd7.png)

7. On the left hand side, click the endpoint you just created. Ours is ```/users```. Then click 'Create Method' and set it to 'GET':

    ![GET](https://cloud.githubusercontent.com/assets/12450298/12849342/1d95f8ca-cc17-11e5-894b-3896f83d3f2f.png)

    Select the 'Lambda function' radio button and then assign it to the Get function we created earlier then press 'Save':

    ![assign GET function](https://cloud.githubusercontent.com/assets/12450298/12849623/87651974-cc18-11e5-8e88-ebf4f2b3c39d.png)

    Click 'Test'. You should see an empty object ```{}``` in the response body:

    ![GET test](https://cloud.githubusercontent.com/assets/12450298/12849531/f5d2f0ee-cc17-11e5-8162-cde17cdab2dc.png)

8. Repeat the previous step but instead of a 'GET', set the method to 'POST':

    ![POST](https://cloud.githubusercontent.com/assets/12450298/12849673/cf1cf82c-cc18-11e5-8c8c-edac7bc0d39d.png)

    Click 'Test' but this time in the request body, add in some details. We've added two users:

    ```json
    {"users": [ {"id": 1, "name": "Peter", "surname": "Smith"},
             {"id": 2, "name": "John", "surname": "Walsh"}
           ]
    }
    ```

9. Go back to your 'GET' method and then click 'Test' again. You should now be able to see that the table has been updated with the details you tested your 'POST' request with.

    ![GET test 2](https://cloud.githubusercontent.com/assets/12450298/12849902/ebfa3602-cc19-11e5-92f6-ffa21320fd20.png)


All done! You can now set up Lambda functions that manipulate information in an AWS DynamoDB table that are invoked through the API Gateway!


### The Serverless Framework _(previously known as JAWS)_
**_Serverless_** is a framework that allows you to build applications that run on AWS Lambda and AWS API Gateway.


#### Why use it?

This framework makes it extremely easy to deploy Lambda functions and API Gateway endpoints from your local machine. It is also _super_ easy to test your functions locally too. If you want to know more about it check out the [Serverless repo](https://github.com/serverless/serverless)

We'll go through the steps to set up their example project 'serverless-starter'. If you haven't checked out our previous examples on how to create and deploy a Lambda function we strongly recommend that before you get stuck into this one:
Here are the steps to set up the Serverless example project 'serverless-starter'.

1. First create an AWS account if you haven't done so already. Follow the steps in our previous examples in order to do this.

2. Go to your IAM console. We're going to have to create a new 'User' that our serverless application will be able to use and attach the neccessary policy in order to initialize it. Go to the 'Users' tab and then click 'Create New Users'. Give your user a name and then click 'Create'. We've called ours 'serverless-admin':

    ![serverless user](https://cloud.githubusercontent.com/assets/12450298/12822479/2d889d44-cb60-11e5-8c89-9420378d6be6.png)

    Once you've created your user, click show credentials. Make a note of them and then download them. _(keep them safe...we'll need them later)_

    ![credentials](https://cloud.githubusercontent.com/assets/12450298/12822483/31bfc428-cb60-11e5-81f0-2990ec32ca41.png)

    Click on your newly created user and then click the blue 'Attach Policy' button. Select the 'AdministratorAccess' policy and then click the 'Attach Policy' button again to attach it.

    ![attach policy](https://cloud.githubusercontent.com/assets/12450298/12822486/35574a98-cb60-11e5-8cd7-2e2f06ab5c41.png)

    Here's the summary of our serverless-admin user:

    ![user summary](https://cloud.githubusercontent.com/assets/12450298/12822489/39388622-cb60-11e5-900d-bda80d95cd5f.png)

3. Next you're going to have to install the AWS CLI if you haven't already done so. You can do so via any of the methods **[here](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)**. Once you've done that, type the ```aws configure``` command into the command line. Use the Access ID and Secret Access ID from the user you just set up, select your region and then press enter for the last option:

    ```bash
    $ aws configure
    AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
    AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    Default region name [None]: eu-west-1
    Default output format [None]: ENTER
    ```
    _(note: you'll still need to reconfigure your AWS CLI, even if you've done so previously)_


4. Now you should be good to get started with Serverless. Run this command to install it globally:

  ```$ npm install serverless -g```

5. It's time to set up your project. For demonstration purposes we've chosen to run [serverless-starter](https://github.com/serverless/serverless-starter) which is a boilerplate example provided by Serverless. In future we'll show you how to set up your own project but for now this is all you need to get used the framework. Run this command in your terminal:

    ```$ serverless project install serverless-starter```

    You'll see this screen and then be prompted to insert some data:

    ![project data](https://cloud.githubusercontent.com/assets/12450298/12822470/2854a2be-cb60-11e5-9822-11913fdd98e1.png)

    Enter the name of the bucket you'd like Serverless to back up your Lambda functions with and an email that alarms can be sent to. Select your region and then select the default AWS profile:

    ```bash
    Serverless: Enter a universally unique project bucket name:  (serverless-starter-nkatqu-ejl6y9.com) learn-serverless
    Serverless: Enter an email to use for AWS alarms:  (me@serverless-starter-nkatqu.com) example@email.com
    Serverless: Select a region for your project:
      us-east-1
      us-west-2
    > eu-west-1
      ap-northeast-1
    Serverless: Select an AWS profile for your project:
    > default
    Serverless: Creating stage "dev"...  
    Serverless: Creating region "eu-west-1" in stage "dev"...  
    Serverless: Creating your project bucket on S3: serverless.eu-west-1.learn-serverless...  
    Serverless: Deploying resources to stage "dev" in region "eu-west-1" via Cloudformation (~3 minutes)...  
    Serverless: No resource updates are to be performed.  
    Serverless: Successfully created region "eu-west-1" within stage "dev"  
    Serverless: Successfully created stage "dev"  
    Serverless: Installing nodejs dependencies for component: restApi...  
    serverless-helpers-js@0.0.3 node_modules/serverless-helpers-js
    └── dotenv@1.2.0
    Serverless: Successfully initialized project "serverless-starter"  
    Serverless: Successfully installed project "serverless-starter"
    ```
6. You should now be able to see the serverless-starter files in your directory:

    ![serverless-starter files](https://cloud.githubusercontent.com/assets/12450298/12822495/3ea624c0-cb60-11e5-87e5-4335faa9320a.png)

7. Click on it. Let's have a look at what's inside. Click on the 'restApi' folder. In there you should see lib, multi and single directories:

    ![inside the files](https://cloud.githubusercontent.com/assets/12450298/12822502/43a7e9c2-cb60-11e5-8bd6-8fa5a0cf963b.png)

    ```lib``` - holds code shared across all of your functions  
    ```multi``` - this is a Serverless module that contains multiple Lambda functions  
    ```single``` - this is another Serverless module containing one Lambda function with multiple endpoints

    In the ```multi``` directory click on the ```create``` directory and then the ```s-function.json``` file. This file contains endpoint configuration information for that Lambda function.

    ![endpoint](https://cloud.githubusercontent.com/assets/12450298/12822510/4c8b6e38-cb60-11e5-80fe-2bc093f7f955.png)

    In the ```single``` directory click on the ```all``` directory and then navigate to its ```s-function.json``` file. Here you can see that a single function has been configured with multiple endpoints. (GET, POST, PUT, DELETE)

    ![endpoints](https://cloud.githubusercontent.com/assets/12450298/12822513/4f450b5c-cb60-11e5-990e-a5d175233442.png)

8. Next we're going to run our Lambda functions locally. Type the following command in your command line. The third piece is the route to your function. We're testing the 'all' function and so ours is:

    ```
    $ serverless function restApi/single/all
    ```

    You should then see the function run and return the results:

    ```
    Serverless: Running restApi/single/all...  
    Serverless: -----------------  
    Serverless: Success! - This Response Was Returned:  
    Serverless: {"message":"Your Serverless function ran successfully via the 'GET' method!"}
    ```
    _Note: The function will take the event from the **event.json** file so you can configure whatever your payload is there. Our test function expects an object with a 'httpMethod' key so our event.json file looks like this:_

    ```json
    {
      "httpMethod": "GET"
    }
    ```

9. Once we are happy with our Lambda functions and API Gateway endpoints we can deploy them from the command line using the ```$ serverless dash deploy``` command. You then use the up and down arrow keys to navigate to, and select (by pressing ```enter```). The ones you select will then be deployed after you've moved back down to 'Deploy' and pressed ```enter```. The selected ones show up in yellow:

    ![deploy serverless](https://cloud.githubusercontent.com/assets/12450298/12822528/5bd60a7e-cb60-11e5-9f55-460af2b6132c.png)

    You'll then see this in your terminal:

    ![deploying in process](https://cloud.githubusercontent.com/assets/12450298/12822531/5f22124a-cb60-11e5-8297-868c0cd250d2.png)

10. We can then go to AWS and check out the S3, Lambda and API Gateway consoles to see if everything has been deployed correctly:

    API Gateway
   ![Api deploy](https://cloud.githubusercontent.com/assets/12450298/12822535/624c67fe-cb60-11e5-8120-9f74d933994d.png)

    S3
   ![S3 deploy](https://cloud.githubusercontent.com/assets/12450298/12822544/6ccb1ca2-cb60-11e5-8d1c-97e8e8224717.png)

   Lambda
   ![lambda deploy](https://cloud.githubusercontent.com/assets/12450298/12822547/70f21056-cb60-11e5-90c8-e2a3fd4aa457.png)

_(The Serverless framework automates a lot of the processes that we have covered in previous examples such as uploading to S3 and deploying to Lambda)_


## Further Reading

+ Walkthrough Custom Events:
http://docs.aws.amazon.com/lambda/latest/dg/walkthrough-custom-events.html
+ Admin Events:
http://docs.aws.amazon.com/lambda/latest/dg/walkthrough-s3-events-adminuser.html
+ lambdash: AWS Lambda Shell Hack http://alestic.com/2014/11/aws-lambda-shell
+ Lambda Persistence: http://alestic.com/2014/12/aws-lambda-persistence
+ Lambda Speed (faster execution): http://alestic.com/2014/11/aws-lambda-speed
+ Lambda Execution Environment and Available Libraries:
http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html
+ Intro to Lambda by [Jeff Douglas](https://github.com/jeffdonthemic) (*Cloud Legend*)
https://www.topcoder.com/blog/amazon-lambda-demo-tutorial/ + https://youtu.be/m7egclrPzSg
+ Alternatives to Lambda:
https://www.quora.com/Are-there-any-alternatives-to-Amazon-Lambda

<br />

## Glossary

* IAM - Identity and Access Management
* ARN - Amazon Resource Number
* Event Source - Event sources publish events that cause a Lambda function to be invoked.

## Concerns?

As exciting as this *incredible* service is, it's only natural to have few concerns:

### Limits?

AWS Lambda has a default safety throttle limit of **100 concurrent Lambda
function executions** per account.
see: http://docs.aws.amazon.com/lambda/latest/dg/limits.html

***Q***: Does this mean we can "*only*" process 100 requests at any given time?  
***A***: No, *it depends* on how long the Lambda function takes to *complete*.
e.g: a request that takes 90ms to complete means your Lambda function can
handle **1000** ***concurrent requests*** *out of the box*.
If that sounds *low* don't panic, if you need more you can easily
*request* a **Service Limit Increase** by submitting a ticket to AWS Support.

### Vendor Lock-in?

As AWS Lambda is an *innovative* approach to executing code
in a dynamically scalable way, no other vendors are
offering something similar you will be *bound* to AWS until
everyone else catches up (copies AWS).
Depending on the up-take in the developer community,
other providers could catch up quite quick (the underlying infrastructure
  to run micro-apps-as-a-service is not *especially complex*!)

At present the ***cost savings*** of not having *idle* capacity
or having to spend time/effort provisioning/managing servers *far* out-weigh
the risk of vendor lock-in.

#### Image Upload & Re-Size Example

+ Image gets uploaded from Browser/Mobile App to Lambda function
+ Lambda does image-rezie and compression
+ Lambda POSTs the original image (900kb) and re-sized (100kb) to S3

Total time: 120ms (which gets rounded up to 200ms)

##### Calculation

+ 2 POST requests (one for original one for compressed image) = $0.005/1000x2 = $0.00001
+ Lambda request $0.0000002
+ Lambda execution cost $0.00001667*2 = $0.00003334

So $0.00004354 per request
Or **$43.54** to upload **One Milion** images.  
***Just*** the **Lambda** component of this is: **$33.54**

Given how efficient Node.js is you could probably run a single small/medium
EC2 instance for the same budget; crucially with Lambda though, you would
not pay for the *idle* time e.g. while your users are asleep!


**Note**: the S3 storage costs would still be the same if you
used a Heroku or EC2 instance to handle the upload/resize/compresion task.

1,000,000 images x (900,000 + 100,000) = 100 Gigabytes or 100 GB  
So 100 x $0.030 = **$30 per month** to store a million images!


##### S3 Pricing

+ **GET**: $0.004 per 10,000 requests
+ **PUT**, COPY, **POST**, or LIST Requests: **$0.005** per 1,000 requests
+ **$0.0300** *per* **GB** stored

## Lambda Pricing

You are charged for the total number of requests across all your functions.
Lambda counts a request each time it starts executing in response to an
event notification or invoke call, including test invokes from the console.

+ First 1 million requests per month are free
+ $0.20 per 1 million requests thereafter ($0.0000002 per request)
+ Execution time is rounded up to the nearest 100ms
+ You are charged $0.00001667 for every GB-second used

See: http://aws.amazon.com/lambda/pricing/ for more ***pricing examples***.

## FAQ

### How do you add an existing NPM module to a Lambda function?

You might want to add some additional functionality to your Lambda functions in the form of an NPM module. Here are four easy steps you need to take in order to do so!

1. Firstly let's create a new directory that will hold our Lambda function and all of its modules
    ```
    $ mkdir lambdaNPM
    $ cd lambdaNPM
    ```

2. Install an NPM package of your choice. We'll use the `aws-sdk` as an example

    ```
    $ npm install --prefix=~/lambdaNPM aws-sdk
    aws-sdk@2.0.27 node_modules/aws-sdk
    ├── xmlbuilder@0.4.2
    └── xml2js@0.2.6 (sax@0.4.2)
    $ ls node_modules
    aws-sdk
    ```

3. Test that the module has been installed
    ```
    $ echo 'var AWS = require("aws-sdk");console.log(AWS.EC2.apiVersions)'> test.js
    $ node test.js
    [ '2013-06-15*','2013-10-15*','2014-02-01*','2014-05-01*','2014-06-15*','2014-09-01*','2014-10-01' ]
    ```

    Here we're just requiring the sdk and then piping the code into `test.js`. Then if we run `test.js` we should be able to see the EC2 API versions printed in the console. This is a trivial test just to prove that the module has been installed.

4. Create your function

    At this point we’ve successfully created a directory containing one or more npm-installed packages and verified that the packages can load and execute by running a test script locally. You can now delete the test script and continue by creating a real Lambda function that takes advantage of the modules that you’ve just installed, testing it the same way. To deploy the resulting function and modules to Lambda, just zip up the entire lambdaTestFunction directory and use Lambda’s createFunction API, CLI, or the console UI to deploy it.

Credit to the [AWS Compute Blog Post](https://aws.amazon.com/blogs/compute/nodejs-packages-in-lambda/)
