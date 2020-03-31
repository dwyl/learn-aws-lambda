### Continuous Integration using Codeship
After writing your tests, the next step is to set up Continuous Integration (CI) for your Lambda Functions so every time you push up your code to GitHub, the tests are run and the code is deployed to AWS if the tests pass. This example goes through how to set up CI using Codeship.

Some initial set up of your project repo is required. This involves having a lambda function file in the correct format (with an `exports.handler` function), and a `data.json` file with a test event. The flow will be as follows:
* Push code to GitHub
* This triggers Codeship
* Codeship runs the tests
* If tests pass, Codeship deploys Lambda function to AWS, else build fails
* Codeship invokes Lambda function on AWS with the test event to check live version is working as expected
* If successful, Codeship reports build succeeded!

**Follow along with this simple example to try out setting up the process yourself**
1. Create a FREE account on [Codeship](https://codeship.com) and connect to your GitHub account

1. Fork this repo on Github!

1. Create a project in Codeship connecting to your forked repo.

   If you have any problems with the Step 1 or 3, follow the instructions on the Codeship documentation.

1. Create a hello-world Lambda function on AWS following the steps in [this earlier section](create-lambda-inline.md). In the 'Configuration' tab **Make sure that the name of the handler is changed from 'index.handler' to 'LambdaTest.handler'. 'LambdaTest' will be the name of the zip file that we upload to AWS through Codeship.**

   Also make a note of the ARN for the lambda function - it can be found in the top right hand corner of the page. It should have the form: `arn:aws:lambda:YOUR_AWS_REGION:YOUR_AWS_ACCOUNT_ID:function:YOUR_FUNCTION_NAME`. You'll need it when setting up the Deployment Script on Codeship.
![Lambda arn](https://cloud.githubusercontent.com/assets/5912647/12617272/de1cc1b8-c506-11e5-98e4-1dc8692450e0.png)

1. Create a User for Codeship in AWS and get an AWS 'access key' and 'access secret key'.

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
   ```json
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
           "lambda:CreateFunction"
         ],
         "Resource": [
           "YOUR_LAMBDA_FUNCTION_ARN_HERE"
         ]
       }
     ]
   }
   ```

   Then click 'Validate Policy' and if the validation is successful, click 'Create Policy'.

1. Add the AWS User Environment variables to your Codeship project. In the Environment tab in Codeship, add your `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY` and `AWS_DEFAULT_REGION` (usually `us-east-1`). This is needed in order to authorise the Codeship to execute commands from the aws cli.
![Environment variables](https://user-images.githubusercontent.com/5222954/32383573-bdf7ad6e-c08e-11e7-938a-0ab81f78e830.png)

1. Set up Test and Deployment Scripts for your Codeship project

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

1. Make a change and push up to GitHub! Try modifying the `LamdaTest.js` file and/or the `data.json` file, commit the change and push the code up to GitHub. This should trigger Codeship.  View the build log to make sure the build is successful and the test passes.
![Codeship build log](https://user-images.githubusercontent.com/5222954/32383448-634406ce-c08e-11e7-9697-5a66ceed3c5c.png)

   Also have a look at the monitoring tab in your Lambda function console. You should see a spike where the function was invoked by Codeship.
![AWS monitoring log](https://cloud.githubusercontent.com/assets/5912647/12619412/cb2df10e-c50f-11e5-8af3-d53c11d4953b.png)

For more information have at the Codeship documentation:
* [Integrating AWS Lambda with Codeship](https://blog.codeship.com/integrating-aws-lambda-with-codeship/)
* [Deployment to AWS Lambda](https://documentation.codeship.com/basic/continuous-deployment/deployment-to-aws-lambda/)
