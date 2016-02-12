
# Example Lambda App: Notepad

In this tutorial we are going to build a little app
that allows us to take notes and save them to Amazon DynamoDB
via an AWS Lambda Function (*available from AWS API Gateway*).

## *Try it*: https://s3-eu-west-1.amazonaws.com/dwyl/notes.html

[![lambda-notes](https://cloud.githubusercontent.com/assets/194400/12956276/24059c68-d01f-11e5-90ee-d9100b692ef3.png)](https://s3-eu-west-1.amazonaws.com/dwyl/notes.html)


### Pre-requisites

This mini-tutorial expects you to have:

+ An Amazon Web Services (***AWS***) Account: http://aws.amazon.com/
+ *Basic* Node.js/JavaScript Knowledge

Everything else will be covered step-by-step!

## *How*?

This step-by-step guide will take you from zero to Lambda-based
Note taking app in the next 15 minutes.


### Step 1: Create The DynamoDB Table to Hold your Notes

We need a place to store our Notes (data). DynamoDB is a great place for it.

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
  "notes": "Hello World!"
}
```

You should now have one item in your *Notes* table:

![dynamo-db-showing-notes-item](https://cloud.githubusercontent.com/assets/194400/12699057/ed299e5a-c7a5-11e5-87d1-4be2729b378c.png)

<br />

### Step 2: Give Lambda Permission to Access the DynamoDB Table

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

<br />

### Step 3: Create your Lambda Function(s)

#### 1. Create a Lambda Function that Gets a Notes Record from DynamoDB

From the AWS Console, select Lambda:

![aws-menu-click-lambda](https://cloud.githubusercontent.com/assets/194400/12714195/23869db0-c8cb-11e5-86d6-f7564c0e8957.png)

Then click "***Create a Lambda function***":

![aws-create-lambda-function](https://cloud.githubusercontent.com/assets/194400/12714210/46a81832-c8cb-11e5-8e15-46ca2cffc9c2.png)


When prompted to chose from a "*Blueprint*" click "***Skip***":

![aws-lambda-select-blueprint](https://cloud.githubusercontent.com/assets/194400/12714483/02529976-c8cd-11e5-8dec-e731c7b6d397.png)

#### 2. Name your Lambda function "*GetNotes*"

![aws-lambda-getnotes-function-name-and-desc](https://cloud.githubusercontent.com/assets/194400/12714998/a48fe52a-c8cf-11e5-8868-f1d265e70919.png)

#### 3. Paste this code into the in-line editor


```js
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {
  var cb = function(err, data) {
    if(err) {
      console.log('error on GetNotes: ',err);
      context.done('Unable to retrieve notes', null);
    } else {
      if(data.Item && data.Item.notes) {
        context.done(null, data.Item);
      } else {
        context.done(null, {});
      }
    }
  };
  dynamo.getItem({TableName:"Notes", Key:{Id:"1"}}, cb);
};
```

#### 4. Test your `GetNotes` Lambda Function

Confirm that your `GetNotes` Lambda function can access DynamoDB by running a "*Test*":  
(*click the* "***Test***" *button to run your function*)

![aws-lambda-service-test](https://cloud.githubusercontent.com/assets/194400/12765442/9b54d60a-c9f6-11e5-8e61-539cfd2e5d58.png)

In the logs below your Lambda code, you should expect to see:

```js
{
  "Id": "1",
  "notes": "Hello World!"
}
```

#### 5. Create Your *Second* Lambda Function to *Save* Notes to DynamoDB

The steps are similar to the previous Lambda function you *just* created.
Again, click "*Skip*" when asked if you want to use a "*boilerplate*" for
your new function.

Then enter the following details:

+ Name: `SaveNotes`
+ Description: `Save ("Put") Notes to DynamoDB Notes Table`
+ Runtime: `Node.js`
+ Handler: `index.handler`
+ Role: `APIGatewayLambdaDynamoDB`

Then ***paste*** the following code:

```js
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();
exports.handler = function(event, context) {
    var item = { Id:"1",
              notes: event.notes // notes passed in as PUT request body
            };

    var cb = function(err, data) {
        if(err) {
            console.log(err);
            context.fail('unable to update notes at this time');
        } else {
            console.log(data);
                context.done(null, data);
        }
    };
    dynamo.putItem({TableName:"Notes", Item:item}, cb);
};
```

![aws-lambda-setnotes-function](https://cloud.githubusercontent.com/assets/194400/12767103/3b4ffa24-c9ff-11e5-91c3-94aaa554b8a5.png)


Leave all other ("*Advanced*") settings as default and click "***Next***"


![aws-lambda-click-next](https://cloud.githubusercontent.com/assets/194400/12766168/39d0019e-c9fa-11e5-881c-6067af0ed429.png)

Review the function and click "***Create Function***":

![aws-lambda-create-function](https://cloud.githubusercontent.com/assets/194400/12766675/c2dced88-c9fc-11e5-8014-012f9ab73846.png)

You should expect to see a message confirming your Lambda Function was created:

![aws-lambda-congrats](https://cloud.githubusercontent.com/assets/194400/12766831/966842ec-c9fd-11e5-9d13-51176a82ca02.png)

#### 6. *Test* the `SaveNotes` Lambda Function

Testing this Lambda function is *similar* to the previous one,
the only difference is that you will be prompted to input some test event *data*.

*Paste* the following:

```js
{
  "Id": "1",
  "notes": "These are my Lambda Notes!"
}
```
And then click the "***Save and Test***" button:

![aws-savenotes-test-data](https://cloud.githubusercontent.com/assets/194400/12766992/8ca30f84-c9fe-11e5-9fb2-4193e2264c90.png)

You should expect to see the following:

![aws-savenotes-test-output](https://cloud.githubusercontent.com/assets/194400/12767136/75d6dac8-c9ff-11e5-88fe-661fd920de5b.png)

Now if you go back and *Test* the `GetNotes` function, you should expect to
see the following output:

![aws-getnotes-updated-test-output](https://cloud.githubusercontent.com/assets/194400/12767169/aeca5404-c9ff-11e5-99f4-49abf2cd5551.png)

<br />

### Step 4: Expose your Lambda Functions through AWS API Gateway

There are *three* ways to make your Lambda functions accessible
to the outside world using the AWS API Gateway;
we are going to use the "*easy*" way.

While viewing your `GetNotes` Lambda function, click on the
***API endpoints*** tab and then click "**Add API Endpoint**"

![aws-lambda-create-api-endpoint](https://cloud.githubusercontent.com/assets/194400/12767909/1feedb88-ca04-11e5-9e7f-0823681ef6e3.png)

Then configure your endpoint with the followin:

+ API endpoint type: `API Gateway`
+ API name: `LambdaMicroservice`
+ Resource name: `/GetNotes`
+ Method: `GET`
+ Deployment stage: `prod`
+ Security: `Open` (*expect to see a warning message*)

Once you have entered/selected the data, click "***Submit***":

![aws-lambda-add-api-endpoint-getnotes](https://cloud.githubusercontent.com/assets/194400/12768075/2da8d0c0-ca05-11e5-8f0c-42c1f29b5bb4.png)

You should see a *confirmation*  message informing you that
your API endpoint for function `GetNotes` has been added at a *Specific* URL.

![lambda-api-endpoint-exposed](https://cloud.githubusercontent.com/assets/194400/12768188/ffdc6b06-ca05-11e5-88c0-d82b4720cb68.png)

In the case of our *example* the URL is:  
`https://r09u5uw11g.execute-api.eu-west-1.amazonaws.com/prod/GetNotes`

#### Test Endpoint Using `cURL`

Try "curl-ing" the endpoint:
```sh
curl -v https://r09u5uw11g.execute-api.eu-west-1.amazonaws.com/prod/GetNotes
```
You should see:

![aws-lambda-curl-getnotes-endpoint-](https://cloud.githubusercontent.com/assets/194400/12768433/7e7e9d84-ca07-11e5-8648-d51ccf99d690.png)

#### Repeat the previous steps for the `/SaveNotes` Lambda Function


+ API endpoint type: `API Gateway`
+ API name: `LambdaMicroservice`
+ Resource name: `/SaveNotes`
+ Method: `POST`
+ Deployment stage: `prod`
+ Security: `Open` (*expect to see a warning message*)

Once you have successfully created the endpoint, you can test it.

### `cURL` /SaveNotes endpoint with POST data

```sh
curl -v -H "Content-Type: application/json" -X POST -d '{"Id":"1","notes":"Updated Notes!"}' https://r09u5uw11g.execute-api.eu-west-1.amazonaws.com/prod/SaveNotes
```
Running that command will return an *empty* Object as response.

We can *confirm* that the notes were *updated* by re-running the `GetNotes`
curl command:

```sh
curl https://r09u5uw11g.execute-api.eu-west-1.amazonaws.com/prod/GetNotes
```
Which should return:
```sh
{"Id":"1","notes":"Updated Notes!"}
```
<br />

### Step 5. Enable CORS for the Endpoints

Right now your API endpoints are accessible via `cURL`
or "*Postman*" but will be *blocked* by browser's "*Same Origin Policy*".

If you attempt to access the API Gateway endpoint via XMLHttpRequest ("*Ajax*") in the
browser you will see a `No 'Access-Control-Allow-Origin'` Error:

![aws-lambda-cors-error](https://cloud.githubusercontent.com/assets/194400/12768553/33c41e3a-ca08-11e5-96e4-1844bee177c0.png)

> Official CORS Docs for Lambda:
http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html#how-to-cors-console

#### 1. In your API Gateway click "*Enable CORS*"

Select the resource/method you want to enable CORS for,
click "***Enable CORS***" button.

![aws-api-gateway-enable-cors](https://cloud.githubusercontent.com/assets/194400/12949495/0f49e2f8-d000-11e5-91f5-45b22fc434b7.png)

#### 2. Click: "*Enable CORS and replace existing CORS headers*"

Leave all the default values as they are.
(*you can always come back and change them later...*)

![aws-awpi-gateway-enable-cors-and-replace](https://cloud.githubusercontent.com/assets/194400/12949601/aa98f1e0-d000-11e5-9610-476bbb431b71.png)

#### 3. Click "*Yes, Replace Existing Values*"

In the "*modal*" window that pops up, click the button labeled "*Yes, Replace Existing Values*":

![aws-api-gateway-replace-exisiting-values](https://cloud.githubusercontent.com/assets/194400/12949769/91cf5f72-d001-11e5-891e-28b84d2ff578.png)

#### 4. Confirmation CORS ENabled

You should see a confirmation message similar to this:

![aws-api-gateway-cors-enabled](https://cloud.githubusercontent.com/assets/194400/12949968/af135c04-d002-11e5-9462-182f569e5853.png)


<br />

### Step 6. Deploy your API!

#### 1. Click on "*Deploy API*"

![aws-api-gateway-deploy-api](https://cloud.githubusercontent.com/assets/194400/12947112/1e151550-cff1-11e5-832c-b439cb33d3eb.png)

#### 2. Configure the API to "*prod*"

![aws-api-gateway-deploy-prod](https://cloud.githubusercontent.com/assets/194400/12950590/d78c21fe-d005-11e5-96ee-578f53bfc9f0.png)

#### 3. Confirm your Configuration > "*Save Changes*"

![aws-api-gateway-deploy-confirm](https://cloud.githubusercontent.com/assets/194400/12951660/53e5068a-d00b-11e5-965b-5d995851f7fb.png)

Copy the `Invoke URL` displayed as you will use it in the next two steps.


#### 4. Test it in your Terminal with `cURL`

To *confirm* that the CORS (``) header is being set for the endpoint,

```sh
curl -v https://r09u5uw11g.execute-api.eu-west-1.amazonaws.com/prod/GetNotes
```

You should expect to see output similar to the following:

![aws-api-gateway-curl-confims-access-control-header](https://cloud.githubusercontent.com/assets/194400/12952679/2ffb2c00-d00f-11e5-9b56-4548dd3304f4.png)

The important line is: `< Access-Control-Allow-Origin: *` which *confirms*
that we can access the API endpoint from *any origin*.


<br />

### Step 7. Update the `baseURL` in `notes.html`

Open the `notes.html` file and scroll down to the JavaScript section where `baseURL` is defined.

Replace the *value* of `baseURL` with the API Gateway Invoke URL you used for your `cURL` request above.

e.g:

```js
  var baseURL = 'https://r09u5uw11g.execute-api.eu-west-1.amazonaws.com/prod';
```



### Step 8: Upload your "Client" `notes.html` App to S3

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

Try it!


## Background Reading

+ Amazon API Gateway Tutorial by Auth0:
https://auth0.com/docs/integrations/aws-api-gateway
+ Measuring response time with cURL:
http://stackoverflow.com/questions/18215389/how-do-i-measure-request-and-response-times-at-once-using-curl

## Performance?

try:

For the API Gateway Endpoint
```sh
ab -n 10000 -c 1000 https://r09u5uw11g.execute-api.eu-west-1.amazonaws.com/prod/GetNotes
```

For the notes "app":

```sh
ab -n 10000 -c 1000 https://s3-eu-west-1.amazonaws.com/dwyl/notes.html
````
