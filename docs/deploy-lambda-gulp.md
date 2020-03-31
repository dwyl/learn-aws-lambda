# Deploying Lambda Functions using Gulp
[Gulp](https://github.com/gulpjs/gulp/blob/master/docs/API.md) can be used to automate the zipping, deployment and testing of Lambda functions on AWS. The Codeship deployment script can then be reduced to a single command `gulp deploy`!

The syntax to create a new Gulp task is:

```js
gulp.task('name of task', function () {
  return // gulp functions to run
});
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

1. Declare Constants.
   ```js
   var region       = 'eu-west-1';  // AWS region
   var functionName = 'LambdaTest';  
   var outputName   = 'LambdaTest.zip'; // name to be given to output zip file

   // the ARN of the execution role to be given to the lambda function
   // change this to a role from your account
   var IAMRole = 'arn:aws:iam::685330956565:role/lambda_basic_execution';

   // the paths of the files to be added to the zip folder
   var filesToPack = ['./lambda-testing/functions/LambdaTest.js'];
   ```

   **Make sure the IAM role is changed to the ARN of a role from your AWS account and the region is set to the AWS region you want to deploy the Lambda function to!**

1. Create an archive folder and add the project files
   ```js
   gulp.task('js', function () {
     return gulp.src(filesToPack, {base: './lambda-testing/functions'})
       .pipe(gulp.dest('dist/'));
   });
   ```

   `gulp.src` takes an array of file paths as the first argument and an options object as the second. If you specify a base file path in the options only the folders/files after the base are copied i.e. in this case, only the `LambdaTest.js` file is copied into the archive folder (`dist`).  

1. Add the node modules to the archive folder
   ```js
   gulp.task('node-modules', function () {
     return gulp.src('./package.json')
       .pipe(gulp.dest('dist/'))
       .pipe(install({ production: true }));
   });
   ```

   In this task, the `package.json` file is copied to the archive folder and the `gulp-install` module is used to do an `npm install --production` of all the listed dependencies.

1. Zip up the archive folder and save it.
   ```js
   gulp.task('zip', function () {
     return gulp.src(['dist/**', '!dist/package.json'])
       .pipe(zip(outputName))
       .pipe(gulp.dest('./'));
   });
   ```

   All the files in the dist folder apart from the `package.json` file are zipped up using the `gulp-zip` module and save in the root of the project folder.

1. Upload the zip file to AWS. If the function already exists, update it, otherwise create a new Function.

   We can create an 'upload' task with gulp:
   ```js
   gulp.task('upload', function() {});
   ```

   Inside the function we first have to do a bit of set up:
   ```js
   // this is set to eu-west-1 from the constants declared in step 1
   AWS.config.region = region;
   var lambda = new AWS.Lambda();
   // the outputName has also been set in step 1
   var zipFile = './' + outputName;
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
       else callback(data);
     });
   }
   ```
 
   The `getZipFile` function takes a callback which gets called with the file data if the file is read successfully.

   Using the `aws-sdk` we can then define a function to create a new Lambda function from this zip file.

   ```js
   function createFunction () {
     getZipFile(function (data) {
       var params = {
         Code: {
           ZipFile: data // buffer with the zip file data
         },
         // functionName was set in the constants in step 1
         FunctionName: functionName,
         // need to set this as the name of our lambda function file is LambdaTest.js
         Handler: 'LambdaTest.handler',
         Role: IAMRole, // IAMRole was set in the constants in step 1
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

1. Invoke the function with a test event to check the live version is working as expected.

   We have to first get the function to make sure it exists and only invoke it if there isn't an error.

   In the parameters for invoking the function, a JSON object can be specified as the `Payload` and the `InvocationType` can be specified as `RequestResponse` if you want to get a response body.

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
       });
     }
   });
   ```

1. Create a deployment task that runs all the above tasks in series in the correct order.

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

1. Add the deployment script to Codeship or your package.json

   In Codeship just add `gulp-deploy` to your Deployment script and you're good to go!

   **Note: Make sure the Access Policy of the Codeship User in the IAM console on AWS has permissions for all the actions you're trying to execute. i.e. getting, creating, updating and invoking lambda functions.**

## Upload to S3 and Deploy to Lambda With Gulp
Here we will implement the previous example of uploading a Lambda function to S3 and then deploying it from the bucket. Intead of using a bash script we can use Gulp. We can make some small adjustments to the Gulp example that we just created in order to deploy from S3. This is a continuation from that so please check it out before you look at this one:

1. We're going to want to create a new Gulp task that will upload our zip file. We've called our task `upload-to-s3` and we've included it just after our zip task.

   The first thing we do is create a new S3 instance using the AWS SDK because we'll need to access some S3 methods. We then declare the path of the zip file we want to upload to be used as the S3 Key. We then created a `getZipFile` function that will get the `Body` for the parameters and also wrap around the `putObject` method. We then write the S3 method which takes params _(an object with `Bucket`, `Key` and `Body` within it)_ and a callback that handles errors is called when a response from the service is returned.
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
         else next(data);
       });
     }
   });
   ```

1. Next we need to add our new task to the list of tasks in our `runSequence` that we've already created. We want it to come after zipping but before our `upload` task:
   ```JavaScript
   gulp.task('deploy', function (callback) {
     return runSequence(
       ['js', 'node-mods'],
       ['zip'],
       ['upload-to-s3'],
       ['upload'],
       ['test-invoke'],
       callback
     );
   });
   ```

1. In order for our Lambda function to be deployed from S3, we're going to have to adjust our `createFunction` & `updateFunction` Lambda methods that we created previously.

   We needed to change the 'Code' parameter from `ZipFile: data` to:
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

1. Because we added some more AWS methods, we'll need to update our policy so that it supports this. Go to your IAM console and add the necessary methods. Here's ours:
![policy](https://cloud.githubusercontent.com/assets/12450298/12679928/e3ee941a-c69e-11e5-9e39-4ea1dcf95fda.png)

   We included a `getObject` method to check if the object had been uploaded already.
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

1. Your script should be good to go! Once you've run it go to your S3 and Lambda consoles to check if your Lambda function has been uploaded and deployed:
![uploaded](https://cloud.githubusercontent.com/assets/12450298/12680122/0be2f64a-c6a0-11e5-91e4-c452adf3e766.png)

   ![deployed](https://cloud.githubusercontent.com/assets/12450298/12680144/2241d87a-c6a0-11e5-8e15-2c5fc32e3470.png)


## Deploy your Lambda functions using the deployment module we wrote - `npm dpl`

We decided to write `dpl` to make deploying your Lambda functions _extremely_ easy. Here's how to implement it:

1. `$ npm install dpl --save-dev`

1. Configure your environment variables. You need `AWS_REGION` and `AWS_IAM_ROLE`  
   ```
   export AWS_REGION=eu-west-1
   export AWS_IAM_ROLE=arn:aws:iam::123456789:role/LambdaExecRole
   ```

1. Add the _list_ of files to deploy to your `package.json`:
   ```json
   "files_to_deploy": [ "package.json", "index.js", "lib/" ]
   ```

1. Add the deployment script to your `package.json`
   ```json
   "scripts": {
     "deploy": "dpl"
   }
   ```

1. Run the script
   ```
   $ npm run deploy
   ```
