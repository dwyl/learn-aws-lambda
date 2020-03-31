# 'HELLO WORLD!' Example (inline)
Here's a super simple walkthrough of a 'HELLO WORLD!' example to help get you started with AWS Lambda:

1. If you haven't already done so, create a free AWS account **[here](http://aws.amazon.com/)**.

1. Sign in to the AWS management console, select your region in the top right hand corner and then open the AWS Lambda console.

1. On the 'Learn to Build' section click on 'see all' and then select 'Run a Serverless "Hello World!"'.

1. Select that you want to make a blueprint and search for the 'hello-world' example.

1. Once you have found this follow the instructions given to set up your function. This will include setting a role (a role is an AWS identity with permission policies that determine what the identity can or cannot do in AWS. For more information on roles click **[here](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)**). Like the tutorial suggests we chose the 'lambda_basic_execution' role because our function is extremely simple.

1. AWS Lambda expects us to export an object which has a property called handler. You can specify the handler and the runtime you wish to give it in the 'Function code' section:
![Handler and Runtime](https://user-images.githubusercontent.com/16775804/47663592-45a74400-db95-11e8-9a11-ab095749afd6.png)

1. Now your function has been created you have the chance to edit its code. Under the 'Function code' title, edit the existing inline code. Here's our example:
![Configure Function](https://user-images.githubusercontent.com/16775804/47664750-a0da3600-db97-11e8-8acf-0408a4011ecc.png)  

   The value of that property is a function that takes two arguments, event and context. The event will be created by us and the context consists of the runtime information which will be supplied by AWS lambda. They both take the form of JSON objects.

1. In the 'Basic Settings' section you can specify the amount of memory that each AWS Lambda instance should be allocated. **_Note: by increasing the memory, this also increases the cost of your function runtime!_**
![Memory allocation](https://user-images.githubusercontent.com/16775804/47665920-370f5b80-db9a-11e8-9788-748cd0f00a17.png)

1. We can test our function by clicking on the 'Test' button in the top right.
Here we will be able to specify the payload of the event that gets passed to our function. There will be an existing event template but we changed the key value pairs as shown below:
![event object](https://user-images.githubusercontent.com/16775804/47663969-f9a8cf00-db95-11e8-8d71-c982b388a909.png)

   Click the 'Test' button to test your function and then click to expand the results.

1. Below your function you should now be able to see the results from your test. Here are the results from our example:
![test results](https://user-images.githubusercontent.com/16775804/47664134-560bee80-db96-11e8-8551-a2ebd6963814.png)

   You can reconfigure your test at any time. Click on the 'Actions' dropdown beside the 'Test' button and select the 'Configure test event' option.
