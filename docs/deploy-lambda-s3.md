# Upload Your Lambda Function to an S3 Bucket and Automatically Deploy it to Lambda (bash script example)
In this example will build a script that will execute the neccessary steps to upload a Lambda function to S3 where it can be stored and then automatically deploy it to Lambda.

We will be writing our own bash script that will involve the use of some of the AWS CLI commands. Follow these instructions on how to get set up with the AWS CLI on your local machine:
1. If you haven't already done so, set up an account with AWS **[here](http://aws.amazon.com/)**.

1. You'll then need to get your 'access key ID' and 'secret access key' by doing the following:
   * Open the IAM console
   * In the navigation pane choose 'Users'
   * Click your IAM username
   * Click 'Security Credentials' and then 'Create Access Key'
   * To see your access key, choose Show User Security Credentials. Your credentials will look something like this:
     * Access Key ID: `AKIAIOSFODNN7EXAMPLE`
     * Secret Access Key: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
   * Click 'Download Credentials' and store them in a secure location

1. Install the AWS CLI via a method of your choice **[here](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)**.

1. Once it's installed you have to configure it. Type ```aws configure``` in the command line. You should see something like this:
   ```bash
   $ aws configure
   AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
   AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   Default region name [None]: eu-west-1
   Default output format [None]: ENTER
   ```
   Enter your aws access key, secret access key and region then press enter on the last option.

   You should now be good to go!

1. Next write a Lambda function in your text editor if you haven't already. Check out our **[previous example](create-lambda-inline-zip.md)** up until step 4 _(we'll be automating the zipping in this example)_.  

1. Once you've done this you'll want to create a new S3 bucket that will store all of your uploaded Lambda functions. Click on the S3 console on the AWS Management Console window:
![s3 console](https://cloud.githubusercontent.com/assets/12450298/12646827/32f97802-c5ca-11e5-84a8-b49e2cd0e929.png)

   Click the 'Create Bucket' button. Give your S3 Bucket a name and select its region. We've called ours 'lambda-function-container':
![s3 create bucket](https://cloud.githubusercontent.com/assets/12450298/12646889/8f342590-c5ca-11e5-8e2f-e2cb2bccf04d.png)

1. Next you'll want to write a bash script that will perform 3 commands. The first is to create your deployment package (a .ZIP file containing your lambda function and its dependencies). The second will upload the deployment package to your newly created S3 Bucket. The third will deploy your Lambda function from S3.

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

1. Let's create the script that we'll run in our `package.json` that will trigger the `.sh` file we just created:
![script link](https://cloud.githubusercontent.com/assets/12450298/12648830/b1af1d4c-c5d3-11e5-91af-0d32691b7764.png)

   In order to be able to run our script we have to make it **_executable_**. Type this command into your terminal:

   ```chmod +x (filenameOfScript.sh)```

1. One final step before we'll be able to run our script. Go back to AWS and go to the IAM console because you need to add some   policies that enable you to perform certain methods like 'create-function' or 'put-object'.

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

1. In the command line, run the script in your ```package.json```. Ours is as follows:

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

1. Go to S3 to check if the deployment package has been uploaded. You should see your ```.ZIP``` file:
![s3 uploaded](https://cloud.githubusercontent.com/assets/12450298/12650714/bcb0664e-c5db-11e5-9d08-a2bf2f2c32ff.png)

1. Go to Lambda to check if your Lambda function has been enabled:
![lambda enabled](https://cloud.githubusercontent.com/assets/12450298/12650757/ee4b886e-c5db-11e5-8505-08b3b4bc0958.png)

    That's all! You should now be able to upload and deploy a Lambda function with a single bash script.
