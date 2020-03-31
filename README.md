# Learn Aws Lambda
![aws lambda intro image](http://i.imgur.com/9ImDKrv.jpg)

Learn to use AWS Lambda to create scalable micro-services in less time and cost *far* less to run than "*traditional*" server-based apps.

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
Amazon Web Services (AWS) Lambda lets you run JavaScript (Node.js), Java & Python scripts/apps in Amazon's (virtually) infinitely-scalable cloud environment without having provision VM instances or other "*orchestration*"; Everything is dynamically auto-scaled so if you have 1 user or 1 billion you pay for *usage*.

### *Self*-Disruption
AWS are effectively [*disrupting*](https://en.wikipedia.org/wiki/Disruptive_innovation) their (*own*) *existing* business with Lambda. Instead of forcing us to pay for EC2 instances in fixed increments and have complex application monitoring/scaling, AWS have built a *much simpler* way of building & running *micro-services*.

Lambda also disrupts other Platform-as-a-Service ("**PaaS**") providers such as Heroku, Google App Engine, Azure or Modulus where you pay for a *specific* amount of compute power & RAM but have a ***scaling delay*** and scale in a ***fixed increment*** (instances).

### Lambda Features
#### Ephemeral Storage
No access to a filesystem or memory persistence (e.g. on-instance Redis) so you cannot store data or the `result` of an operation *locally*.

#### Use an AWS Datastore Service
The lack of *local* persistence on Lambda is resolved by having low-latency access to AWS S3 and *other* AWS Datastores e.g: [ElastiCache](https://aws.amazon.com/elasticache/) (in-memory cache), [DynamoDB](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) (NoSQL ssd-based database), [RDS](https://aws.amazon.com/rds/) (*relational database*), however there's an important (and potentially *expensive*) catch: PUT/POST/GET requests to all AWS data stores are **NOT** Free! While per-run costs on Lambda are tiny, if you GET and PUT something to S3 on each execution cycle you could rack up the bill!

## *How*?
+ General Intro (*if you're completely new, watch the video!*): http://aws.amazon.com/lambda
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
* [Trigger a Lambda function when an email comes in to the AWS Simple Email Service (SES)](/docs/trigger-lambda-ses.md)
* [Testing Lambda Functions](/docs/test-lambda-functions.md)
* [Continuous Integration using Codeship](/docs/codeship-ci.md)
* [Upload Lambda Function to S3 and deploy to Lambda](/docs/deploy-lambda-s3.md)
* [Deploying Lambda Functions using Gulp](/docs/deploy-lambda-gulp.md)
* [Versioning and Aliasing Lambda Functions](/docs/version-alias-functions.md)
* [Create an API with GET/POST Methods using Lambda functions to retrieve/update records from a DynamoDB table](/docs/get-post-lambda-dynamodb.md)
* [Serverless Framework](/docs/serverless-framework.md)

## Further Reading
+ [Walkthrough Custom Events](http://docs.aws.amazon.com/lambda/latest/dg/walkthrough-custom-events.html)
+ [Admin Events](http://docs.aws.amazon.com/lambda/latest/dg/walkthrough-s3-events-adminuser.html)
+ [lambdash: AWS Lambda Shell Hack](http://alestic.com/2014/11/aws-lambda-shell)
+ [Lambda Persistence](http://alestic.com/2014/12/aws-lambda-persistence)
+ [Lambda Speed (faster execution)](http://alestic.com/2014/11/aws-lambda-speed)
+ [Lambda Execution Environment and Available Libraries](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html)
+ Intro to Lambda by [Jeff Douglas](https://github.com/jeffdonthemic) (*Cloud Legend*)
  - https://www.topcoder.com/blog/amazon-lambda-demo-tutorial
  - https://youtu.be/m7egclrPzSg
+ [Alternatives to Lambda](https://www.quora.com/Are-there-any-alternatives-to-Amazon-Lambda)

## Glossary
* IAM - Identity and Access Management
* ARN - Amazon Resource Number
* Event Source - Event sources publish events that cause a Lambda function to be invoked.

## Concerns?
As exciting as this *incredible* service is, it's only natural to have few concerns:

### Limits?
AWS Lambda has a default safety throttle limit of **100 concurrent Lambda function executions** per account, see: http://docs.aws.amazon.com/lambda/latest/dg/limits.html

***Q***: Does this mean we can "*only*" process 100 requests at any given time?  
***A***: No, *it depends* on how long the Lambda function takes to *complete*. e.g: a request that takes 90ms to complete means your Lambda function can handle **1000** ***concurrent requests*** *out of the box*. If that sounds *low* don't panic, if you need more you can easily *request* a **Service Limit Increase** by submitting a ticket to AWS Support.

### Vendor Lock-in?
As AWS Lambda is an *innovative* approach to executing code in a dynamically scalable way, no other vendors are offering something similar you will be *bound* to AWS until everyone else catches up (copies AWS). Depending on the up-take in the developer community, other providers could catch up quite quick (the underlying infrastructure to run micro-apps-as-a-service is not *especially complex*!)

At present the ***cost savings*** of not having *idle* capacity or having to spend time/effort provisioning/managing servers *far* out-weigh the risk of vendor lock-in.

#### Image Upload & Re-Size Example
+ Image gets uploaded from Browser/Mobile App to Lambda function
+ Lambda does image-resize and compression
+ Lambda POSTs the original image (900kb) and re-sized (100kb) to S3

Total time: 120ms (which gets rounded up to 200ms)

##### Calculation
+ 2 POST requests (one for original one for compressed image) = $0.005 / 1000 * 2 = $0.00001
+ Lambda request $0.0000002
+ Lambda execution cost $0.00001667 * 2 = $0.00003334

So $0.00004354 per request Or **$43.54** to upload **One Milion** images.  
***Just*** the **Lambda** component of this is: **$33.54**

Given how efficient Node.js is you could probably run a single small/medium EC2 instance for the same budget; crucially with Lambda though, you would not pay for the *idle* time e.g. while your users are asleep!

**Note**: the S3 storage costs would still be the same if you used a Heroku or EC2 instance to handle the upload/resize/compresion task.

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

See: http://aws.amazon.com/lambda/pricing for more ***pricing examples***.

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

Credit to the [AWS Compute Blog Post](https://aws.amazon.com/blogs/compute/nodejs-packages-in-lambda/).
