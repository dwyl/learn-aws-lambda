# Learn Aws Lambda  [Work in Progress!!]

![aws lambda intro image](http://i.imgur.com/9ImDKrv.jpg)

Learn to use AWS Lambda to create scalable micro-services

## What is Lambda?

Amazon Web Services (AWS) Lambda lets you run JavaScript (Node.js)
scripts/apps in Amazon's (virtually) infinately-scalable cloud environment
without having to *think* about servers, instances or memory.
Everything is dynamically auto-scaled so if you have 1 user or 1 billion
you pay for *usage*.

> http://docs.aws.amazon.com/lambda/latest/dg/welcome.html
- How it Works: http://docs.aws.amazon.com/lambda/latest/dg/lambda-introduction.html


## The "*Old*" Way

### EC2

Pay for Compute/RAM/Storage in fixed units and scale at the container level.

### Heroku / Nodejitsu

Similar to EC2 (in that you pay a "reserve" amount for
specific amount of compute power & RAM)
but much easier to scale transparently to your app.
However both Heroku and Nodejitsu have a **scaling delay** and
a fixed increment for scaling (instances)

## Lambda Features

### Ephemeral

No access to a filesystem or memory persistance (e.g. on-instance Redis)
so you cannot store data or the result of an opperation locally.
This is resolved by having low-latency access to AWS S3 but there's an
important (and potentially *expensive*) catch: S3 PUT/POST/GET requests
are **NOT** Free! While per-run costs on Lambda are tiny, if you GET and PUT
something to S3 on each execution cycle you could rack up the bill!

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

## Concerns

As exciting as this *incredible* service is, I have a few concerns:

### Vendor Lock-in

Because this is an innovative approach to running node.js code
(this is what nodejitsu *could* have been!) no other vendors are
offering something similar you will be *bound* to AWS until
everyone else catches up (copies AWS).
Depending on the up-take in the developer community,
other providers could catch up quite quick (the underlying infrastructure
  to run micro-apps-as-a-service is not especially complex!).

### Limits

+ Concurrent requests (during the Lambda preview)	**50**

http://docs.aws.amazon.com/lambda/latest/dg/limits.html

## Create and Test Your Own AWS Lambda Function
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

## Further Reading

+ Walkthrough Custom Events:
http://docs.aws.amazon.com/lambda/latest/dg/walkthrough-custom-events.html
+ Admin Events:
http://docs.aws.amazon.com/lambda/latest/dg/walkthrough-s3-events-adminuser.html
+ lambdash: AWS Lambda Shell Hack http://alestic.com/2014/11/aws-lambda-shell
+ Lambda Persistence: http://alestic.com/2014/12/aws-lambda-persistence
+ Lambda Speed (faster execution): http://alestic.com/2014/11/aws-lambda-speed
