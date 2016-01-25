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

+ General Intro (*if you're completely new, watch the video!*): http://aws.amazon.com/lambda/
+ How it Works: http://docs.aws.amazon.com/lambda/latest/dg/lambda-introduction.html
+ Getting Started Guide (Overview): http://docs.aws.amazon.com/lambda/latest/dg/welcome.html


## The "*Old*" Way

### EC2

Pay for Compute/RAM/Storage in *fixed* units and scale at the container level.
This required a lot of "***DevOps***" oversight

### Heroku / Modulus

Similar to EC2 (in that you pay a "reserve" amount for
specific amount of compute power & RAM)
but much easier to scale transparently to your app.
However both Heroku and Modulus have a ***scaling delay*** and
scale in a ***fixed increment*** (instances).

## Lambda Features

### Ephemeral

No access to a filesystem or memory persistance (e.g. on-instance Redis)
so you cannot store data or the result of an opperation *locally*.
This is resolved by having low-latency access to AWS S3  
and *other* AWS Datastores ()
but there's an
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

At present the cost savings of not having *idle* capacity far out-weigh



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

### 'HELLO WORLD!' Example (.ZIP)
  An alternative _(and perhaps more commonly used)_ way of creating an AWS Lambda function is to write it in a text editor, zip it up and then upload it. Here's how:

  1. Follow the first two steps of the previous example if you haven't already created an AWS account.

  2. On the 'Select blueprint' page hit the 'skip' button because we'll be creating our own.

  3. On the 'Configure Function' page give your Lambda function a name and then select the 'Upload a .ZIP file' radio button. It will then prompt you to upload a file.

   ![zip file upload](https://cloud.githubusercontent.com/assets/12450298/12537249/181e2fac-c2b2-11e5-9363-68d7505c4651.png)

  4. Open up your text editor and write your Lambda function just as you would if you were writing it inline and then save it as a ```.js``` file:

   ![function code](https://cloud.githubusercontent.com/assets/12450298/12537413/7374470c-c2b6-11e5-8e3a-9baaa99c06aa.png)

  5. Zip up this file by typing the following into the command line. The command consists of the first filename which is the zip file you want to create _(call it whatever you like .zip)_ followed by the files you want to zip up. In our example you can see the name of the ```.js``` file we created earlier:

   ```$ zip -r hello-world.zip hello-world.js```

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
