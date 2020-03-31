# Create an API with GET/POST Methods that uses Lambda functions to retrieve/update records from a DynamoDB table

1. First we'll need to create a table in DynamoDB. Go to the DynamoDB console and then click the 'Create Table' button. Give your table a name _(call it something relevant to the type of data your DynamoDB table will hold)_. We've called ours `Users`. The 'Primary key' is made up of a 'Partition key' _(hash key)_ and an optional 'Sort key'. _(The partition key is used to partition data across hosts for scalability and availability)_:
![create table](https://cloud.githubusercontent.com/assets/5912647/12557398/7114929c-c382-11e5-9c48-5c2bf15649ac.png)

   ![table name](https://cloud.githubusercontent.com/assets/12450298/12714300/c9a4e152-c8cb-11e5-8c35-370393cef70e.png)

   For 'Table settings' just check the 'Use default settings' checkbox and then click the blue 'Create' button:
![table setup](https://cloud.githubusercontent.com/assets/12450298/12714466/db3a51d0-c8cc-11e5-882f-a3b09df203a4.png)

1. Once the table is created, click on the 'Alarms' tab and then delete the basic alarms if they have been created:
![alarms](https://cloud.githubusercontent.com/assets/12450298/12714608/9da7b6ea-c8cd-11e5-8b5c-f09f94d3e66a.png)

   Then click on the 'Capacity' tab and then specify the 'Read' and 'Write' capacity units as 3 each and then click 'Save':
![capacity](https://cloud.githubusercontent.com/assets/12450298/12714552/5fe19b1e-c8cd-11e5-919a-780c3bb06316.png)

1. Next we will have to create a policy that allows your AWS functions to access Cloudwatch logs as well as the table you just created. Go to the IAM console, select 'Roles' and then 'Create new role'. We've called ours `APIGatewayLambdaExecRole`:
  ![create role](https://cloud.githubusercontent.com/assets/12450298/12714889/11c25804-c8cf-11e5-8b32-e01f9673b8cf.png)

   Select the 'AWS Lambda' role:
![lambda role](https://cloud.githubusercontent.com/assets/12450298/12714963/651140f6-c8cf-11e5-87f5-f547605f757a.png)

   And then click 'Next step' to skip the 'Attach Policy' section:
![skip attach policy](https://cloud.githubusercontent.com/assets/12450298/12714986/8de42822-c8cf-11e5-9fc8-9aad5ed4b799.png)

   In the 'Review' section click the blue 'Create Role' button to finish:
![review role](https://cloud.githubusercontent.com/assets/12450298/12715013/bcb3bc1c-c8cf-11e5-8fce-37f32546d0b5.png)

   Click on the title of the role you just created then click the down arrow for 'Inline Policies'. Follow the link to create an inline policy:
![inline policies](https://cloud.githubusercontent.com/assets/12450298/12715091/385b678e-c8d0-11e5-8006-1d65487b933e.png)

   Click on the 'Custom Policy' radio button and then click 'Select':
![custom policy](https://cloud.githubusercontent.com/assets/12450298/12715150/857ad6e4-c8d0-11e5-9688-c6237746e742.png)

   Give your custom policy a name _(we've called ours 'LogAndDynamoDBAccess')_ and then enter the following in the 'Policy Document' section. **Make sure your "Resource" at the bottom is set to the ARN of your table and the second "SID" is set to "_YourTableName_DynamoDBReadWrite"**. _(the ARN can be found in your 'Table details' by going to your DynamoDB console and clicking on your table.)_:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AccessCloudwatchLogs",
         "Action": [
           "logs:*"
         ],
         "Effect": "Allow",
         "Resource": "arn:aws:logs:*:*:*"
       },
       {
         "Sid": "UsersDynamoDBReadWrite",
         "Effect": "Allow",
         "Action": [
           "dynamodb:DeleteItem",
           "dynamodb:GetItem",
           "dynamodb:PutItem",
           "dynamodb:UpdateItem"
         ],
         "Resource": [
           "arn:aws:dynamodb:eu-west-1:655240720487:table/Users"
         ]
       }
     ]
   }
   ```

1. Now we need to create the Lambda functions for adding and retrieving data to and from the table _(we'll be creating our functions in a text editor, zipping them up and then uploading them to Lambda. Follow the instructions in the previous 'HELLO WORLD!' .zip example on how to do this)_:

   Create a new `.js` file that will contain our first Lambda function. This function will GET information from the DynamoDB table. We've called the file `getUserInfo.js`. Here is the code:
   ```JavaScript
   var AWS = require('aws-sdk');
   var DOC = require('dynamodb-doc');
   var dynamo = new DOC.DynamoDB();

   exports.handler = function(event, context) {
     var callback = function(err, data) {
       if (err) {
         console.log('error on getUserInfo: ', err);
         context.done('Unable to retrieve user information', null);
       } else {
         if(data.Item && data.Item.users) {
           context.done(null, data.Item.users);
         } else {
           context.done(null, {});
         }
       }
     };

     dynamo.getItem({TableName:"Users", Key:{username:"default"}}, callback);
   };
   ```

   Zip up the file and then upload it to Lambda:
   ```
   zip -r getUserInfo.zip getUserInfo.js
   ```

   ![getuserinfo](https://cloud.githubusercontent.com/assets/12450298/12716616/ceb37a6a-c8d9-11e5-80be-54ebf8b9754d.png)

   For the Role, select the one we created earlier. Then click 'Next' and then 'Create function':
![role](https://cloud.githubusercontent.com/assets/12450298/12716846/6d4dcd82-c8db-11e5-9b01-3dccc12d8fa5.png)

   Click 'Test' to test the function. The results should return an empty objext `{}`.

   Create a second `.js` file that will contain our second Lambda function. This function will UPDATE information in our DynamoDB table. We've called the file `updateUserInfo.js`. Here is the code:
   ```JavaScript
   var AWS = require('aws-sdk');
   var DOC = require('dynamodb-doc');
   var dynamo = new DOC.DynamoDB();
   
   exports.handler = function(event, context) {
     var item = {
       username:"default",
       users: event.users || {}
     };
   
     var callback = function(err, data) {
       if (err) {
         console.log(err);
         context.fail('unable to update users at this time');
       } else {
         console.log(data);
         context.done(null, data);
       }
     };
   
     dynamo.putItem({TableName:"Users", Item:item}, callback);
   };
   ```

   Again zip up the file and then upload it to Lambda:
   ```
   zip -r updateUserInfo.zip updateUserInfo.js
   ```

   Follow the same steps as the previous function to create the second one, giving it the same role. They should both now appear in your functions section:
![functions](https://cloud.githubusercontent.com/assets/12450298/12717241/7e1805bc-c8de-11e5-9c0c-9974a961cef7.png)

   Test the function with a sample event relevant to your data. We created the following sample event:
   ```json
   {
     "users": [
       {
         "id": 1,
         "name": "John Smith",
         "location": "London"
       }
     ]
   }
   ```

   You should see an empty obect just like the first function `{}`. Go back to the `GetUserInfo` function and then click 'Test' again. You should now see a returned result with the object in your sample event like this:
   ```json
   [
     {
       "id": 1,
       "location": "London",
       "name": "John Smith"
     }
   ]
   ```

1. We're going to have to create one more Lambda function. It essentially does nothing but it is required by the OPTIONS method for CORS _(Cross Origin Resource Sharing which is a mechanism that allows restricted resources on a web page to be requested from)_. The function is as follows:

   ```JavaScript
     exports.handler = function(event, context) {
       context.succeed('');
     }
   ```
  
   Upload it just like the previous Lambda functions:
![noop](https://cloud.githubusercontent.com/assets/12450298/12744540/be1404a0-c98c-11e5-8a7b-a0dfb74bc6f1.png)

1. Next go to the Amazon API Gateway console and create a new API by clicking 'Create API'. Give it a name, we've called our API 'SecureUsers':
![api gateway](https://cloud.githubusercontent.com/assets/12450298/12744749/cd30dd9a-c98d-11e5-97ce-217fe7adf74f.png)

   Click on the 'Create Resource' button and then give your resource a name. We've called ours `Users`:
![create resource button](https://cloud.githubusercontent.com/assets/12450298/12849024/2d7ae61c-cc15-11e5-8e92-1cefb9cc7bee.png)

   Click 'Create Resource' again to confirm it:
![create resource config](https://cloud.githubusercontent.com/assets/12450298/12849056/5e7c7082-cc15-11e5-87cc-51d921af1bd7.png)
  
1. On the left hand side, click the endpoint you just created. Ours is `/users`. Then click 'Create Method' and set it to 'GET':
![GET](https://cloud.githubusercontent.com/assets/12450298/12849342/1d95f8ca-cc17-11e5-894b-3896f83d3f2f.png)

   Select the 'Lambda function' radio button and then assign it to the Get function we created earlier then press 'Save':
![assign GET function](https://cloud.githubusercontent.com/assets/12450298/12849623/87651974-cc18-11e5-8e88-ebf4f2b3c39d.png)

   Click 'Test'. You should see an empty object `{}` in the response body:
![GET test](https://cloud.githubusercontent.com/assets/12450298/12849531/f5d2f0ee-cc17-11e5-8162-cde17cdab2dc.png)

1. Repeat the previous step but instead of a 'GET', set the method to 'POST':
![POST](https://cloud.githubusercontent.com/assets/12450298/12849673/cf1cf82c-cc18-11e5-8c8c-edac7bc0d39d.png)

   Click 'Test' but this time in the request body, add in some details. We've added two users:
   ```json
   {
     "users": [
       {
         "id": 1,
         "name": "Peter",
         "surname": "Smith"
       },
       {
         "id": 2,
         "name": "John",
         "surname": "Walsh"
       }
     ]
   }
   ```

1. Go back to your 'GET' method and then click 'Test' again. You should now be able to see that the table has been updated with the details you tested your 'POST' request with.
![GET test 2](https://cloud.githubusercontent.com/assets/12450298/12849902/ebfa3602-cc19-11e5-92f6-ffa21320fd20.png)

All done! You can now set up Lambda functions that manipulate information in an AWS DynamoDB table that are invoked through the API Gateway!
