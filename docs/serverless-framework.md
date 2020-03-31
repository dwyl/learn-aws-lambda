# The Serverless Framework _(previously known as JAWS)_
**_Serverless_** is a framework that allows you to build applications that run on AWS Lambda and AWS API Gateway.

## Why use it?
This framework makes it extremely easy to deploy Lambda functions and API Gateway endpoints from your local machine. It is also _super_ easy to test your functions locally too. If you want to know more about it check out the [Serverless repo](https://github.com/serverless/serverless).

We'll go through the steps to set up their example project `serverless-starter`. If you haven't checked out our previous examples on how to create and deploy a Lambda function we strongly recommend that before you get stuck into this one:
Here are the steps to set up the Serverless example project `serverless-starter`.

1. First create an AWS account if you haven't done so already. Follow the steps in our previous examples in order to do this.

1. Go to your IAM console. We're going to have to create a new 'User' that our serverless application will be able to use and attach the neccessary policy in order to initialize it. Go to the 'Users' tab and then click 'Create New Users'. Give your user a name and then click 'Create'. We've called ours `serverless-admin`:
![serverless user](https://cloud.githubusercontent.com/assets/12450298/12822479/2d889d44-cb60-11e5-8c89-9420378d6be6.png)

   Once you've created your user, click show credentials. Make a note of them and then download them. _(keep them safe...we'll need them later)_
![credentials](https://cloud.githubusercontent.com/assets/12450298/12822483/31bfc428-cb60-11e5-81f0-2990ec32ca41.png)

   Click on your newly created user and then click the blue 'Attach Policy' button. Select the `AdministratorAccess` policy and then click the 'Attach Policy' button again to attach it.
![attach policy](https://cloud.githubusercontent.com/assets/12450298/12822486/35574a98-cb60-11e5-8cd7-2e2f06ab5c41.png)

   Here's the summary of our `serverless-admin` user:
![user summary](https://cloud.githubusercontent.com/assets/12450298/12822489/39388622-cb60-11e5-900d-bda80d95cd5f.png)

1. Next you're going to have to install the AWS CLI if you haven't already done so. You can do so via any of the methods **[here](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)**. Once you've done that, type the `aws configure` command into the command line. Use the Access ID and Secret Access ID from the user you just set up, select your region and then press enter for the last option:
   ```bash
   $ aws configure
   AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
   AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   Default region name [None]: eu-west-1
   Default output format [None]: ENTER
   ```
   _(note: you'll still need to reconfigure your AWS CLI, even if you've done so previously)_

1. Now you should be good to get started with Serverless. Run this command to install it globally:

   ```$ npm install serverless -g```

1. It's time to set up your project. For demonstration purposes we've chosen to run [serverless-starter](https://github.com/serverless/serverless-starter) which is a boilerplate example provided by Serverless. In future we'll show you how to set up your own project but for now this is all you need to get used the framework. Run this command in your terminal:

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

1. You should now be able to see the serverless-starter files in your directory:
![serverless-starter files](https://cloud.githubusercontent.com/assets/12450298/12822495/3ea624c0-cb60-11e5-87e5-4335faa9320a.png)

1. Click on it. Let's have a look at what's inside. Click on the `restApi` folder. In there you should see `lib`, `multi` and `single` directories:
![inside the files](https://cloud.githubusercontent.com/assets/12450298/12822502/43a7e9c2-cb60-11e5-8bd6-8fa5a0cf963b.png)

   `lib` - holds code shared across all of your functions  
   `multi` - this is a Serverless module that contains multiple Lambda functions  
   `single` - this is another Serverless module containing one Lambda function with multiple endpoints

   In the `multi` directory click on the `create` directory and then the `s-function.json` file. This file contains endpoint configuration information for that Lambda function.
![endpoint](https://cloud.githubusercontent.com/assets/12450298/12822510/4c8b6e38-cb60-11e5-80fe-2bc093f7f955.png)

   In the `single` directory click on the `all` directory and then navigate to its `s-function.json` file. Here you can see that a single function has been configured with multiple endpoints. (GET, POST, PUT, DELETE)
![endpoints](https://cloud.githubusercontent.com/assets/12450298/12822513/4f450b5c-cb60-11e5-990e-a5d175233442.png)

1. Next we're going to run our Lambda functions locally. Type the following command in your command line. The third piece is the route to your function. We're testing the 'all' function and so ours is:
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

1. Once we are happy with our Lambda functions and API Gateway endpoints we can deploy them from the command line using the `$ serverless dash deploy` command. You then use the up and down arrow keys to navigate to, and select (by pressing `enter`). The ones you select will then be deployed after you've moved back down to 'Deploy' and pressed `enter`. The selected ones show up in yellow:
![deploy serverless](https://cloud.githubusercontent.com/assets/12450298/12822528/5bd60a7e-cb60-11e5-9f55-460af2b6132c.png)

   You'll then see this in your terminal:
![deploying in process](https://cloud.githubusercontent.com/assets/12450298/12822531/5f22124a-cb60-11e5-8297-868c0cd250d2.png)

1. We can then go to AWS and check out the S3, Lambda and API Gateway consoles to see if everything has been deployed correctly:

    API Gateway
![Api deploy](https://cloud.githubusercontent.com/assets/12450298/12822535/624c67fe-cb60-11e5-8120-9f74d933994d.png)

    S3
![S3 deploy](https://cloud.githubusercontent.com/assets/12450298/12822544/6ccb1ca2-cb60-11e5-8d1c-97e8e8224717.png)

    Lambda
![lambda deploy](https://cloud.githubusercontent.com/assets/12450298/12822547/70f21056-cb60-11e5-90c8-e2a3fd4aa457.png)

_(The Serverless framework automates a lot of the processes that we have covered in previous examples such as uploading to S3 and deploying to Lambda)_
