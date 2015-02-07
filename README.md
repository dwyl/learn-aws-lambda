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
EC2 instance for


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

- Concurrent requests (during the Lambda preview)	**50**

http://docs.aws.amazon.com/lambda/latest/dg/limits.html
