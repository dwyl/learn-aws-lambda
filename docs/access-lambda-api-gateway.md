# How to Access the Lambda Function via API Gateway
By *default*, access to your API Endpoint and therefore the Lambda function are set to '*Private*' this means that when you attempt to access/visit the function you just created the *API Gateway* endpoint for in the previous section will not be accessible if you attempt to access it.

1. If you aren't already viewing the **API Gateway**, select it from your AWS Console Menu:
![aws01-aws-dashboard-select-api-gateway](https://cloud.githubusercontent.com/assets/194400/12614516/66030ff6-c4f8-11e5-9b3c-3aff954051ee.png)

1. Create an API Key in the **Amazon API Gateway** section of the AWS Console:
![aws02-api-key-create](https://cloud.githubusercontent.com/assets/194400/12613480/f3263f2c-c4f1-11e5-8add-c0d68226deae.png)

1. Create a *New* API Key:
![aws03-api-key-create0ew](https://cloud.githubusercontent.com/assets/194400/12613554/778ca09e-c4f2-11e5-9760-eab3694eed6e.png)

1. Name your key, *Enable* it and click `Save` button:
![aws03-api-key-create-new-specify](https://cloud.githubusercontent.com/assets/194400/12614177/2361edd6-c4f6-11e5-8046-96b23a30233a.png)

1. Once you enable your API Key, a section will appear below the creation form that allows you to assign the new API Key to one of your APIs "*Stage*". Select the API & Stage (*in our case the API is* `LambdaMicroservice` *and the stage is* `prod`) then click the `Add` button:
![aws04-api-key-create-assign-to-stage](https://cloud.githubusercontent.com/assets/194400/12614393/8f1224c8-c4f7-11e5-99d0-aa97b48ae727.png)
You should now see that the API Key is *Enabled* for your `prod` stage:
![aws05-api-key-associated](https://cloud.githubusercontent.com/assets/194400/12614459/0a6ff2b2-c4f8-11e5-9c0d-3a44fb6b1a2a.png)

1. ***Copy*** the ***API key*** from this screen and save it to your notepad.
![aws05-copy-the-api-key](https://cloud.githubusercontent.com/assets/194400/12615054/5630abd0-c4fb-11e5-8737-fe83ccef681f.png)

1. Return to your **AWS Console** and select **Lambda**. This will display the list of your Lambda functions. Select the `Concatenate` Lambda function you created earlier.
![aws06-list-of-lambda-functions](https://cloud.githubusercontent.com/assets/194400/12615084/8e8490b4-c4fb-11e5-9350-dbdc3b4ee733.png)

1. When you are *viewing* your Lambda Function, select the **API Endpoints** tab and *copy* the ***API endpoint URL***:
![aws07-view-api-endpoints-and-copy-the-link](https://cloud.githubusercontent.com/assets/194400/12615388/5216665a-c4fd-11e5-8b50-64b37fcd26b6.png)

1. With the endpoint URL and API Key copied you can now run a `cURL` Command in your terminal to access the endpoint:
   ```sh
   curl --header "x-api-key: LhGU6jr5C19QrT8yexCNoaBYeYHy9iwa5ugZlRzm" https://r09u5uw11g.execute-api.eu-west-1.amazonaws.com/prod/Concatenate
   ```
![aws-lambda-curl-with-api-key-works](https://cloud.githubusercontent.com/assets/194400/12611892/0dae99c6-c4e7-11e5-9fa4-7b2467e336f4.png)

Note: I slightly modified my Lambda function to return a timestamp so I know when the function gets executed:
```js
exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('context:', JSON.stringify(context, null, 2));
    event.key1 = event.key1 || 'Hello'; // set default values
    event.key2 = event.key2 || 'World!';
    console.log('value1 =', event.key1);
    console.log('value2 =', event.key2);
    var date = new Date();
    var time = date.toString();
    context.succeed(event.key1 + ' ' + event.key2 + ' >> ' + time );
};
```

For *even* more steps on enabling API Keys on AWS API Gateway,
see: http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-api-keys.html
