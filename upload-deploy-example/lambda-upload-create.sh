#!/bin/bash

# bash script that will zip up a deployment package, upload a lambda function
# to a specified s3 bucket. The script will then deploy the function to lambda (node version)

echo -n "Enter the name of the files you wish to zip (eg. lambdaFunction.js node_modules): "
read FilesToBeZipped
echo -n "Enter the name of the output zip file (eg. lambdaFunction): "
read ZipFileName
echo -n "Enter the name of the s3 bucket you wish to upload to: "
read BucketName
echo -n "Enter the name of your lambda function: "
read FunctionName
echo -n "Enter a description of your function: "
read Description
echo -n "Enter the ARN of the role you wish to implement: "
read Role

zip -r "$ZipFileName.zip" $FilesToBeZipped

aws s3api put-object --bucket $BucketName --key "./$ZipFileName.zip" --body "./$ZipFileName.zip"

aws lambda create-function --function-name $FunctionName --runtime nodejs \
--role $Role --handler "$ZipFileName.handler" \
--code S3Bucket="$BucketName",S3Key="./$ZipFileName.zip" \
--description "$Description"








# echo -n "Enter the object version (eg. 111111): "
# read ObjectVersion

# add default values to variables
# check whether the version already exists
# role precreated or have to create them
# permission denied, you have to make it an executable
