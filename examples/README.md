
# Example Lambda App: Notepad

In this micro-tutorial we are going to build a little app
that allows us to take notes and save them to Amazon S3
via an AWS Lambda Function (*available from AWS API Gateway*).

### Pre-requisites

This mini-tutorial expects you to have:

+ An Amazon Web Services (***AWS***) Account: http://aws.amazon.com/
+ *Basic* Node.js/JavaScript Knowledge

Everything else will be covered step-by-step!

## *How*?

This step-by-step guide will take you from zero to Lambda-based
Note taking app in the next 10 minutes.


### Part 1 - Create The DynamoDB Table to Hold your Notes


#### 1. *Login* to **AWS Console** and Select ***DynamoDB*** from the menu:

![lambda-locate-dynamo-db](https://cloud.githubusercontent.com/assets/194400/12698876/e93a01f4-c7a0-11e5-9936-052981c03992.png)

#### 2. In the DynamoDB view click "***Create Table***":

![dynamodb-create-table](https://cloud.githubusercontent.com/assets/194400/12698902/e5a7ee2e-c7a1-11e5-9516-50bcdd73cc10.png)

#### 3. Create your DynamoDB Table:

Call your table "***Notes***" and give it a "*Primary Key*" called `Id` of type `String`.
Then click the "***Create***" button:

![dynamodb-table-notes](https://cloud.githubusercontent.com/assets/194400/12698941/7c4379ac-c7a2-11e5-842d-b1f506439157.png)

#### 4. Create an "*Item*" (*Record*) in your *Note* Table:

![dynamodb-create-item](https://cloud.githubusercontent.com/assets/194400/12699021/cc6414b2-c7a4-11e5-845f-215615ae9488.png)

From the "Tree/Text" selector, chose "Text":

![dynamodb-select-text](https://cloud.githubusercontent.com/assets/194400/12699035/5bccb8fc-c7a5-11e5-9867-8da49fed4a7c.png)

Then paste this JSON in as the record and click the "***Save***" button:

```js
{
  "Id": "1",
  "Notes": "Hello World!"
}
```

You should now have one item in your *Notes* table:

![dynamo-db-showing-notes-item](https://cloud.githubusercontent.com/assets/194400/12699057/ed299e5a-c7a5-11e5-87d1-4be2729b378c.png)


### Give Lambda Permission to Access the DynamoDB Table

#### 1. From the AWS Console Select "***Identity & Access Management***"


![lambda-identity](https://cloud.githubusercontent.com/assets/194400/12699139/ae13ad84-c7a8-11e5-8a40-4532786f89e5.png)

#### 2. Select Roles and then "***Create New Role***":

![create-new-role](https://cloud.githubusercontent.com/assets/194400/12699130/7cffb314-c7a8-11e5-81a3-b18208dc74ba.png)

#### 3. Set Role Name to `APIGatewayLambdaDynamoDB` and click "***Next Step***"

![aws-set-role-name](https://cloud.githubusercontent.com/assets/194400/12699145/f89a881e-c7a8-11e5-852f-378970621459.png)

#### 4. Select "***AWS Lambda***" then click "***Next Step***":

![select-lambda](https://cloud.githubusercontent.com/assets/194400/12699151/3a3528ba-c7a9-11e5-8f36-35c132f103c0.png)

#### 5. Click to add an in-line Policy


![aws-role-inline-policy](https://cloud.githubusercontent.com/assets/194400/12699176/49f34a10-c7aa-11e5-8525-2bf0560c15ea.png)

#### 6. Click "Custom Policy" and then "***Select***":

![aws-custom-policy](https://cloud.githubusercontent.com/assets/194400/12699187/986e158a-c7aa-11e5-8dff-ad45fe767d36.png)

#### 7. Call your Policy `LogAndDynamoDBAccess` and paste:


```js
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AccessCloudwatchLogs",
      "Action": ["logs:*"],
      "Effect": "Allow",
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Sid": "PetsDynamoDBReadWrite",
                  "Effect": "Allow",
      "Action": [
                  "dynamodb:DeleteItem",
                  "dynamodb:GetItem",
                  "dynamodb:PutItem",
                  "dynamodb:UpdateItem"
                  ],
      "Resource": ["arn:aws:dynamodb:eu-west-1:182294303866:table/Notes"]
    }
   ]
}
```
> ***Note***: your "*Resource*" value will be different.
To locate yours, view the details of your DynamoDB Table:

![dynamodb-resource-name](https://cloud.githubusercontent.com/assets/194400/12699229/c958863e-c7ab-11e5-9a19-fce240c762f4.png)





### Part 4 - Upload your "Client" App to S3

#### 1. From your **AWS Console** Select ***S3***:


![lambda-01-dashboard-select-s3](https://cloud.githubusercontent.com/assets/194400/12650770/fd48737c-c5db-11e5-861c-9139edac6e63.png)

### 2. Open your "*Bucket*" and upload the `notes.html` file into the bucket.
(If you don't already have a "*Bucket*" on S3, create one now.)

![lambda-s3-upload-file](https://cloud.githubusercontent.com/assets/194400/12697953/17822fd2-c788-11e5-8e3e-aa3e0116f832.png)

![s3-select-file](https://cloud.githubusercontent.com/assets/194400/12697970/a1802f90-c788-11e5-8b67-f53843a9d132.png)

### 3. Now make the `notes.html` file ***Public***:

![s3-make-public](https://cloud.githubusercontent.com/assets/194400/12697992/488b7164-c789-11e5-9c2e-a5dd1a824fb3.png)

### 4. Once you have made the file public, open it in your browser:

![s3-open-the-file](https://cloud.githubusercontent.com/assets/194400/12698363/b9ce937a-c792-11e5-918a-ed3d040c963d.png)

You should expect to see something like this:

![s3-make-notes](https://cloud.githubusercontent.com/assets/194400/12698505/d70f145c-c795-11e5-91e4-6ac5aaac243f.png)

```sh
curl --header "x-api-key: LhGU6jr5C19QrT8yexCNoaBYeYHy9iwa5ugZlRzm" https://mhaggkho54.execute-api.eu-west-1.amazonaws.com/prod
```


## Background Reading

+ Amazon API Gateway Tutorial by Auth0:
https://auth0.com/docs/integrations/aws-api-gateway
