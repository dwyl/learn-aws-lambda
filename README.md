# Learn Aws Lambda

![aws lambda intro image](http://i.imgur.com/9ImDKrv.jpg)

Learn to use AWS Lambda to create scalable micro-services in less time
and cost *far* less to run than "*traditional*" server-based apps.

## What is Lambda?

Amazon Web Services (AWS) Lambda lets you run JavaScript (Node.js), Java & Python
scripts/apps in Amazon's (virtually) infinately-scalable cloud environment
without having provision VM instances or other "*orquestration*";
Everything is dynamically auto-scaled so if you have 1 user or 1 billion
you pay for *usage*.

### *Self*-Disruption

AWS are effectively [*disrupting*](https://en.wikipedia.org/wiki/Disruptive_innovation)
their (*own*) *existing* business by creating Lambda.
Instead of paying for EC2 instances in fixed increments and forcing
people to have complex application monitoring/scaling, they have
built a *much simpler* way of building & running micro-services.

Lambda also disrupts other Platform-as-a-Service ("**PaaS**") providers
such as Heroku or Modulus where you pay a fixed amount for
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

* [Creating a Lambda function inline](#hello-world-example-inline)
* [Creating a Lambda function using a .zip folder](#hello-world-example-.zip)
* [Creating a Lambda function using the AWS API Gateway](#hello-world-example-api-gateway)
* [Triggering a Lambda function using an event from DynamoDB](#triggering-a-lambda-function-using-an-event-from-dynamodb)
* [Using AWS Simple Notification System (SNS) to Invoke a Lambda Function](#using-aws-simple-notification-system-sns-to-invoke-a-lambda-function)
* [Testing Lambda Functions](#testing-lambda-functions)

### 'HELLO WORLD!' Example (inline)

Here's a super simple walkthrough of a 'HELLO WORLD!' example to help get you started with AWS Lambda:

1. If you haven't already done so, create a free AWS account  **[here](http://aws.amazon.com/)**.

2. Sign in to the AWS management console, select your region in the top right hand corner and then open the AWS Lambda console.

3. Choose 'Get Started Now' and then select the 'hello-world' blueprint from the list of option tiles.

4. On the 'Configure Function' page, edit the existing inline code to create your function. AWS Lambda expects us to export an object which has a property called handler. Here's our example:

 ![Configure Function](https://cloud.githubusercontent.com/assets/12450298/12529907/061d8e28-c1c3-11e5-9509-24cd1548417d.png)  

 The value of that property is a function that takes two arguments, event and context. The event will be created by us and the context consists of the runtime information which will be supplied by AWS lambda. They both take the form of JSON objects.

5. Beneath the function you then have to specify the handler and the role you wish to give it. (A role is an AWS identity with permission policies that determine what the identity can or cannot do in AWS. For more information on roles click **[here](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)**). We chose the 'lambda_basic_execution' role because our function is extremely simple:

  ![Handler and Roles](https://cloud.githubusercontent.com/assets/12450298/12529957/dace98fa-c1c4-11e5-9df3-a6709cddcdab.png)

  In the 'Advanced Settings' section you can specify the amount of memory that each AWS Lambda instance should be allocated.
  **_Note: by increasing the memory, this also increases the cost of your function runtime!_**

6. Click 'next' to review your code and then if you are happy click 'create function'. You'll then be taken to your AWS Lambda functions where you should see the one you just created.

  ![Test](https://cloud.githubusercontent.com/assets/12450298/12530052/a8e296b2-c1c8-11e5-9ef1-4d19367a4980.png)

7. We can then test our function by clicking on the blue 'Test' button in the top left. Here we will be able to specify the payload of the event that gets passed to our function. There will be an existing event template but we changed the key value pairs as shown below:

  ![event object](https://cloud.githubusercontent.com/assets/12450298/12530077/e1a703d8-c1c9-11e5-97f8-00cdf390bcdc.png)

  Click the 'Save and test' button to test your function.

8. Below your function you should now be able to see the results from your test. Here are the results from our example:

  ![test results](https://cloud.githubusercontent.com/assets/12450298/12530135/1a62941a-c1cc-11e5-87d8-d8077bd599ce.png)

  You can reconfigure your test at any time. Click on the 'Actions' dropdown beside the 'Test' button and select the 'Configure test event' option.

### 'HELLO WORLD!' Example (.ZIP)
  An alternative _(and perhaps more commonly used)_ way of creating an AWS Lambda function is to write it in a text editor, zip it up and then upload it. Here's how:

  1. Follow the first two steps of the previous example if you haven't already created an AWS account.

  2. On the 'Select blueprint' page hit the 'skip' button because we'll be creating our own.

  3. On the 'Configure Function' page give your Lambda function a name and then select the 'Upload a .ZIP file' radio button. It will then prompt you to upload a file.

   ![zip file upload](https://cloud.githubusercontent.com/assets/12450298/12537249/181e2fac-c2b2-11e5-9363-68d7505c4651.png)

  4. Open up your text editor and write your Lambda function just as you would if you were writing it inline and then save it as a ```.js``` file:

   ![function code](https://cloud.githubusercontent.com/assets/12450298/12537413/7374470c-c2b6-11e5-8e3a-9baaa99c06aa.png)

  5. Zip up this file by typing the following into the command line. The command consists of the first filename which is the zip file you want to create _(call it whatever you like .zip)_ followed by the files you want to zip up. In our example you can see the name of the ```.js``` file we created earlier:

   `$ zip -r hello-world.zip hello-world.js`

    You should now be able to see a ```.ZIP``` file alongside your ```.js``` file.  
    **NOTE: If your function has any dependencies then you must include your ```node_modules``` file within your .ZIP file. Simply add ```node_modules``` after the files you wish to zip up!**

  6. Go back to the 'Configure Function' page and click the 'Upload' button and select the .ZIP file you just created.

  7. Next select the Lambda function handler and role. The handler is the name of the ```.js``` file that contains your function followed by the name of the handler you are exporting. We've selected the basic execution role just like the previous example:

   ![handler and role](https://cloud.githubusercontent.com/assets/12450298/12537454/acee35b4-c2b7-11e5-99ba-3304394f3d18.png)

  8. Just like the previous example, click 'next' and if you are happy with your function click 'Create function'. Your new function should now show up in your list of AWS Lambda functions:

   ![function list](https://cloud.githubusercontent.com/assets/12450298/12537495/94d2171a-c2b8-11e5-861e-9225d3b17f28.png)

   This function can now be tested in the same way as the inline example.

### 'HELLO WORLD!' Example (API Gateway)
Another really cool thing about AWS Lambda is that you can invoke a Lambda function through a web endpoint i.e. they can be triggered via HTTP calls. You can configure these endpoints straight from the AWS Lambda console:

1. Open your AWS Lambda console and click on the function that you wish to create an endpoint for. _(if you haven't created a Lambda function already you can do so by following one of the previous examples!)_

2. On this page Select the 'API endpoints' tab and then click '+ Add API endpoint':

 ![add api endpoint](https://cloud.githubusercontent.com/assets/12450298/12551718/6427822e-c364-11e5-9bda-5138e241e72a.png)

3. Configure your API endpoint settings:

 - API endpoint type : API Gateway  
 - API name : WhateverYouLike  
 - Resource name: /YourLambdaFunctionName  
 - Method : GET/POST/PUT/DELETE...  
 - Deployment stage : Defines the *path through which an API deployment is accessible
 - Security : Defines how your function can be invoked  

    *The path will be a URI ending in >> _.../deploymentStage/ResourceName_

 ![api endpoint settings](https://cloud.githubusercontent.com/assets/12450298/12551817/234565ae-c365-11e5-8afe-64d186c22cbe.png)

 We've set our 'Security' to be 'Open with access key' because this is an example of a more common use case. These keys can be configured by following the link in the blue box.
 **Our example URI will end in >> _.../prod/Concatenate_**

 Click 'Submit' once you are happy with your Lambda function configuration.

4. You should now be able to see your function listed at a URL that has been generated by AWS Lambda.

 ![api url](https://cloud.githubusercontent.com/assets/12450298/12552302/e89c468a-c368-11e5-97a1-4e7bd6d8b718.png)

5. Now let's test our endpoint to see if our Lambda function is being invoked. Go to the AWS console and then click on 'API Gateway' under Application Services. This will take you to a list of your APIs where you should see the one we just created. Click on the title.

 ![api list](https://cloud.githubusercontent.com/assets/12450298/12553323/b4e4db76-c36e-11e5-8de0-8dc8f42aace4.png)

6. Click on the METHOD beneath your Lambda function, in our case it's 'POST'. Then click on the word 'TEST' with the lightning bolt underneath it:

 ![POST method](https://cloud.githubusercontent.com/assets/12450298/12553412/2a88d8d2-c36f-11e5-9786-27472b186c7f.png)

7. Enter the input values that your API will be expecting _(this is event object we have been using to previously test our functions)_ then click the blue 'Test' button on the right. Your response body should then return the results of your Lambda function in the response body :

 ![test api](https://cloud.githubusercontent.com/assets/12450298/12553516/e9a8e220-c36f-11e5-958e-4f3f052ae252.png)

### Triggering a Lambda function using an event from DynamoDB
Lambda functions can be set up to be triggered by events from other AWS services like Dynamo DB tables. This can be used to build applications that react to data modifications.

#### Create a DynamoDB table with a stream enabled

1. In your AWS Console click on the DynamoDB tab. Then click the blue 'Create Table' button.

 ![Create table](https://cloud.githubusercontent.com/assets/5912647/12557398/7114929c-c382-11e5-9c48-5c2bf15649ac.png)

2. Set the 'Table Name' field to be 'LambdaTest' and in the 'Primary Key' field, set 'Partition Key' to be 'Id' of type 'String'. Then click the blue 'Create' button. You will then be directed to the DynamoDB dashboard.

3. Click the 'Manage Stream' button and in the pop up window, select the 'New and Old images' option.

 ![Manage Streams](https://cloud.githubusercontent.com/assets/5912647/12559366/b08d36e0-c38c-11e5-944a-b9da7596ddee.png)

 ![Manage Streams Options](https://cloud.githubusercontent.com/assets/5912647/12559413/edeb637c-c38c-11e5-959e-4fa6388f93dc.png)

You now have a DynamoDB table with streams enabled.

#### Create a Lambda function that will be triggered by changes to the DynamoDB table.

1. Select the 'Tables' option in the navigation pane and select the table you just created.

 ![select table](https://cloud.githubusercontent.com/assets/5912647/12557478/e3e383be-c382-11e5-9456-81d7504a7e8e.png)

2. Click 'Create New Trigger' > 'New Function'. This opens the Lambda Console.

 ![Triggers](https://cloud.githubusercontent.com/assets/5912647/12559453/0ff42378-c38d-11e5-9546-698c39429199.png)

3. The 'Event Source Type' and 'DynamoDB table' fields should already have been filled in. Click 'Next'.

 ![New trigger name](https://cloud.githubusercontent.com/assets/5912647/12557522/1cb82a5a-c383-11e5-9771-50036f46940e.png)

4. In the 'Configure Function' section, give your lambda function a name in the 'Name' field. e.g. 'DynamoDBLambda'. The 'Runtime' should be set to 'Node.js' and the 'Description' should already have been filled in.

There will already be some default code in the 'Lambda Function Code' section. You can leave the code as it is. It is just logging the data from each data row in the event from DynamoDB along with the action e.g. 'INSERT', 'MODIFY'. We will see the output of these logs in a later step.

```js
console.log('Loading function');

exports.handler = function(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
    });
    context.succeed("Successfully processed " + event.Records.length + " records.");
};
```

5. In the 'Lambda function handler and role' section, select the 'DynamoDB event stream role' option. This will open a new window to create an Identity and Access Management Role (IAM). Click the blue 'Allow' button to enable the creation of the role. This is necessary to enable permission for DynamoDB to invoke your Lambda function.

 ![role](https://cloud.githubusercontent.com/assets/5912647/12557588/75019368-c383-11e5-9824-f6c6f721f03d.png)

 ![role name](https://cloud.githubusercontent.com/assets/5912647/12557604/8f24704e-c383-11e5-90f5-2dc15723c2c5.png)

6. Then click 'Next'

7. On the final Review page, in the 'Event Sources' section choose the 'Enable now' option. Then Click 'Create Function'

 ![enable now option](https://cloud.githubusercontent.com/assets/5912647/12557637/ba8ae330-c383-11e5-8fde-f6912a681f51.png)

#### Create Data in the DynamoDB table.

1. Go back to the DynamoDB dashboard and select the 'Tables' tab > 'LambdaTest'. Click 'Create Item'. This will open a pop up window. Enter an 'Id' for your data point. This can be any string you want. Then click 'Save'.

 ![create data button](https://cloud.githubusercontent.com/assets/5912647/12563887/4cd15e34-c3a4-11e5-8b65-c16a909c3637.png)

 ![create data save](https://cloud.githubusercontent.com/assets/5912647/12563894/56dd9852-c3a4-11e5-986a-be381262c536.png)

2. Add in some more items and perform some actions to edit/delete the entries in the table e.g. add attributes, delete items. This can be done by selecting the entry and then clicking the 'Actions' dropdown menu. Each of these actions will be logged by our Lambda function and will be visible in the Cloudwatch logs.

 ![edit data](https://cloud.githubusercontent.com/assets/5912647/12563914/62fb5b38-c3a4-11e5-9830-f87e65a4468b.png)

 ![edit data 2](https://cloud.githubusercontent.com/assets/5912647/12557777/55046eea-c384-11e5-9abe-db37615ba2d4.png)

#### View the output of the Lambda function in response to changes to the DynamoDB table

1. Back in the AWS dashboard open the Lambda console and select the function that you just created.

2. Select the 'Monitoring' tab and then the 'View Logs in CloudWatch' option. Select one of the log streams. You should see the console.log output from the lambda function capturing the create, edit and delete operations you performed on data entries in the DynamoDB table.

 ![view output](https://cloud.githubusercontent.com/assets/5912647/12557807/7320f4a2-c384-11e5-9fcd-b399285fad92.png)

 ![view output 2](https://cloud.githubusercontent.com/assets/5912647/12557836/996c7b22-c384-11e5-88d8-c7b16c368f25.png)

You can now modify the lambda function to perform different operations with the event data from DynamoDB.

### Using AWS Simple Notification System (SNS) to Invoke a Lambda Function

Amazon SNS is a Publisher/Subscribe System. You can create, subscribe and publish to 'Topics' which are the AWS term for a messaging channel. Lambda functions can be subscribed to topics so when a message is published to that topic, the Lambda function will be invoked with the payload of the published message as an input parameter. The Lambda function can then do any number of things with the information in the message including publishing further messages to the same topic or other topics.

#### Create a topic

1. In the AWS SNS console click the 'Create Topic' button.

  ![create topic](https://cloud.githubusercontent.com/assets/5912647/12579896/4652ea94-c423-11e5-8a15-e31c3d586405.png)

2. In the pop up that opens up add the name of your topic e.g. 'Lambda Test' and then click the blue 'Create Topic' button. You should see a message that says 'Successfully created topic'.

  ![create topic pop up](https://cloud.githubusercontent.com/assets/5912647/12579906/54c371de-c423-11e5-8982-9668384cf90a.png)

#### Create a Lambda Function and Subscribe to a topic

1. Follow the instructions in this [previous section](#hello-world-example-inline) to create a Lambda function. In Step 3 of the process select the 'sns-message' blueprint. This function will simply log the message pushed to the SNS topic.

2. Under 'Configure Event Sources' you can select the Lambda topic the function should subscribe to. Select the one we just created: 'LambdaTest'.

  ![configure sources](https://cloud.githubusercontent.com/assets/5912647/12579931/7d7ce47a-c423-11e5-973c-e0e03e1cf990.png)

3. Give your function a name e.g. 'LambdaSNSTest'. There will already be default code in the Lambda Function Code section to console.log the message:

  ```js
  console.log('Loading function');

  exports.handler = function(event, context) {
      //console.log('Received event:', JSON.stringify(event, null, 2));
      var message = event.Records[0].Sns.Message;
      console.log('From SNS:', message);
      context.succeed(message);
  };
  ```

4. In the Execution Role section select 'basic execution role'. In the pop up window, enable the creation of a lambda_basic_execution role and click 'Allow'.

5. On the final Review page, in the 'Event Sources' section choose the 'Enable now' option. Then Click 'Create Function'. You should be redirected back to the Lambda Console with a confirmation messsage: 'Congratulations! Your Lambda function "LambdaSNSTest" has been successfully created and configured with SNS: LambdaTest as an event source.'

![lambda function created](https://cloud.githubusercontent.com/assets/5912647/12579947/97b24344-c423-11e5-93b8-f658b8c9db5b.png)

#### Publish a message to a topic

1. Open the SNS console and select the 'Topics' tab in the left hand menu. Select the 'LambdaTest' topic created in an earlier step. Then click the blue 'Publish to Topic' button.

  ![Publish to topic](https://cloud.githubusercontent.com/assets/5912647/12579960/a5dd5238-c423-11e5-90df-40b3c88f7e05.png)

2. The opens the message editor. The topic ARN is the 'Amazon Resource Name' for the topic. ARNs are used to specify a resource unambiguously across all of AWS.  We don't need to worry about them for this example!
Give your message a subject and add some text to the message body. Leave the 'Time to Leave' field blank and click 'Publish Message' in the bottom right hand corner of the screen. You should be redirected back the SNS console.

  ![Publish message](https://cloud.githubusercontent.com/assets/5912647/12579968/c3410dec-c423-11e5-9189-3dd68fe7060c.png)

NB: Using the JSON Messsage Generator option it is possible to format messages differently for different viewing platforms. Find out more on the [AWS SNS docs](http://docs.aws.amazon.com/sns/latest/dg/PublishTopic.html).

#### Viewing the output of the lambda Function

1. Open up the Cloudwatch logs. Select the 'Logs' tab in the left hand menu.

  ![Logs tab](https://cloud.githubusercontent.com/assets/5912647/12579987/db74a798-c423-11e5-94e4-86965a9c8d82.png)

2. Click on the LambdaSNSTest option and click on the first Log Stream. It will take you to the log output from the SNS message that we published!

  ![Log stream](https://cloud.githubusercontent.com/assets/5912647/12579999/ff48d928-c423-11e5-9b02-45b7ecc7b1d4.png)

  ![Log stream output](https://cloud.githubusercontent.com/assets/5912647/12580016/18dc1f76-c424-11e5-8d27-ecd4f1ae68e0.png)

### Testing Lambda Functions

#### Unit Testing

1. Using Lambda to test Lambda!

AWS lambda has a blueprint that you can use to test another Lambda function.

more info [here](https://aws.amazon.com/blogs/compute/serverless-testing-with-aws-lambda/)

2. Generating mock events and testing locally using a Node.js assertion library

The event and context objects can be mocked so that the lambda function can be tested locally.

By logging the event objects for different types of events e.g. DynamoDB events, SNS notifications, the structure of the event object in each case can be determined and mock objects can be created. Using the 'Test' function in the AWS Lambda console it is possible to view the format of different event objects.

Have a look at [mock-events.js](www.github.com/dwyl/learn-aws-lambda/lambda-testing/mock-events.js) to see some examples.  These can be used to create helper functions to generate mock events.

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

More info on testing lambda functions locally [here](https://medium.com/@AdamRNeary/developing-and-testing-amazon-lambda-functions-e590fac85df4#.romz6yjwv)

Testing by mocking the [context object](http://codedad.net/2016/01/03/test-aws-lambda-function-without-aws/)

3. Using grunt-aws-lambda plugin to test

- cannot set environment variables in Lamdba as with Heroku - use dotenv module?

mMre info [here](https://aws.amazon.com/blogs/compute/continuous-integration-deployment-for-aws-lambda-functions-with-jenkins-and-grunt-part-1/)

### Deploying using gulp

More info on setting up gulp [here](https://medium.com/@AdamRNeary/a-gulp-workflow-for-amazon-lambda-61c2afd723b6#.4rfsrda09)

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

You are charged for the total number of requests across all your functions. Lambda counts a request each time it starts executing in response to an event notification or invoke call, including test invokes from the console.

+ First 1 million requests per month are free
+ $0.20 per 1 million requests thereafter ($0.0000002 per request)
+ Execution time is rounded up to the nearest 100ms
+ You are charged $0.00001667 for every GB-second used

> http://aws.amazon.com/lambda/pricing/
