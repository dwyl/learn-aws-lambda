# Triggering a Lambda function using an event from DynamoDB
Lambda functions can be set up to be triggered by events from other AWS services like Dynamo DB tables. This can be used to build applications that react to data modifications.

## Create a DynamoDB table with a stream enabled
1. In your AWS Console click on the DynamoDB tab. Then click the blue 'Create Table' button.
![Create table](https://cloud.githubusercontent.com/assets/5912647/12557398/7114929c-c382-11e5-9c48-5c2bf15649ac.png)

1. Set the 'Table Name' field to be 'LambdaTest' and in the 'Primary Key' field, set 'Partition Key' to be 'Id' of type 'String'. Then click the blue 'Create' button. You will then be directed to the DynamoDB dashboard.

1. Click the 'Manage Stream' button and in the pop up window, select the 'New and Old images' option.
![Manage Streams](https://cloud.githubusercontent.com/assets/5912647/12559366/b08d36e0-c38c-11e5-944a-b9da7596ddee.png)

   ![Manage Streams Options](https://cloud.githubusercontent.com/assets/5912647/12559413/edeb637c-c38c-11e5-959e-4fa6388f93dc.png)
You now have a DynamoDB table with streams enabled.

## Create a Lambda function that will be triggered by changes to the DynamoDB table
1. Select the 'Tables' option in the navigation pane and select the table you just created.
![select table](https://cloud.githubusercontent.com/assets/5912647/12557478/e3e383be-c382-11e5-9456-81d7504a7e8e.png)

1. Click 'Create New Trigger' > 'New Function'. This opens the Lambda Console.
![Triggers](https://cloud.githubusercontent.com/assets/5912647/12559453/0ff42378-c38d-11e5-9546-698c39429199.png)

1. The 'Event Source Type' and 'DynamoDB table' fields should already have been filled in. Click 'Next'.
![New trigger name](https://cloud.githubusercontent.com/assets/5912647/12557522/1cb82a5a-c383-11e5-9771-50036f46940e.png)

1. In the 'Configure Function' section, give your lambda function a name in the 'Name' field. e.g. 'DynamoDBLambda'. The 'Runtime' should be set to 'Node.js' and the 'Description' should already have been filled in.

   There will already be some default code in the 'Lambda Function Code' section. You can leave the code as it is. It is just logging the data from each data row in the event from DynamoDB along with the action e.g. 'INSERT', 'MODIFY'. We will see the output of these logs in a later step.

   ```js
   console.log('Loading function');

   exports.handler = function(event, context) {
     //console.log('Received event:', JSON.stringify(event, null, 2));
     event.Records.forEach(function(record) {
       console.log(record.eventID);
       console.log(record.eventName);
       console.log('DynamoDB Record: %j', record.dynamodb);
     });
     context.succeed("Successfully processed " + event.Records.length + " records.");
   };
   ```

1. In the 'Lambda function handler and role' section, select the 'DynamoDB event stream role' option. This will open a new window to create an Identity and Access Management Role (IAM). Click the blue 'Allow' button to enable the creation of the role. This is necessary to enable permission for DynamoDB to invoke your Lambda function.
![role](https://cloud.githubusercontent.com/assets/5912647/12557588/75019368-c383-11e5-9824-f6c6f721f03d.png)

   ![role name](https://cloud.githubusercontent.com/assets/5912647/12557604/8f24704e-c383-11e5-90f5-2dc15723c2c5.png)

1. Then click 'Next'

1. On the final Review page, in the 'Event Sources' section choose the 'Enable now' option. Then Click 'Create Function'
![enable now option](https://cloud.githubusercontent.com/assets/5912647/12557637/ba8ae330-c383-11e5-8fde-f6912a681f51.png)

## Create Data in the DynamoDB table
1. Go back to the DynamoDB dashboard and select the 'Tables' tab > 'LambdaTest'. Click 'Create Item'. This will open a pop up window. Enter an 'Id' for your data point. This can be any string you want. Then click 'Save'.
![create data button](https://cloud.githubusercontent.com/assets/5912647/12563887/4cd15e34-c3a4-11e5-8b65-c16a909c3637.png)

   ![create data save](https://cloud.githubusercontent.com/assets/5912647/12563894/56dd9852-c3a4-11e5-986a-be381262c536.png)

1. Add in some more items and perform some actions to edit/delete the entries in the table e.g. add attributes, delete items. This can be done by selecting the entry and then clicking the 'Actions' dropdown menu. Each of these actions will be logged by our Lambda function and will be visible in the Cloudwatch logs.
![edit data](https://cloud.githubusercontent.com/assets/5912647/12563914/62fb5b38-c3a4-11e5-9830-f87e65a4468b.png)

   ![edit data 2](https://cloud.githubusercontent.com/assets/5912647/12557777/55046eea-c384-11e5-9abe-db37615ba2d4.png)

## View the output of the Lambda function in response to changes to the DynamoDB table
1. Back in the AWS dashboard open the Lambda console and select the function that you just created.

2. Select the 'Monitoring' tab and then the 'View Logs in CloudWatch' option. Select one of the log streams. You should see the console.log output from the lambda function capturing the create, edit and delete operations you performed on data entries in the DynamoDB table.
![view output](https://cloud.githubusercontent.com/assets/5912647/12557807/7320f4a2-c384-11e5-9fcd-b399285fad92.png)

   ![view output 2](https://cloud.githubusercontent.com/assets/5912647/12557836/996c7b22-c384-11e5-88d8-c7b16c368f25.png)

You can now modify the lambda function to perform different operations with the event data from DynamoDB.
