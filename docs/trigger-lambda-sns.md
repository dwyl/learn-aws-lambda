# Trigger a Lambda function using the Simple Notification System
Amazon SNS is a Publisher/Subscribe System. You can create, subscribe and publish to 'Topics' which are the AWS term for a messaging channel. Lambda functions can be subscribed to topics so when a message is published to that topic, the Lambda function will be invoked with the payload of the published message as an input parameter. The Lambda function can then do any number of things with the information in the message including publishing further messages to the same topic or other topics.

## Create a topic
1. In the AWS SNS console click the 'Create Topic' button.
![create topic](https://cloud.githubusercontent.com/assets/5912647/12579896/4652ea94-c423-11e5-8a15-e31c3d586405.png)

2. In the pop up that opens up add the name of your topic e.g. 'Lambda Test' and then click the blue 'Create Topic' button. You should see a message that says 'Successfully created topic'.
![create topic pop up](https://cloud.githubusercontent.com/assets/5912647/12579906/54c371de-c423-11e5-8982-9668384cf90a.png)

## Create a Lambda Function and Subscribe to a topic
1. Follow the instructions in this [previous section](#hello-world-example-inline) to create a Lambda function. In Step 3 of the process select the 'sns-message' blueprint. This function will simply log the message pushed to the SNS topic.

2. Under 'Configure Event Sources' you can select the Lambda topic the function should subscribe to. Select the one we just created: 'LambdaTest'.
![configure sources](https://cloud.githubusercontent.com/assets/5912647/12579931/7d7ce47a-c423-11e5-973c-e0e03e1cf990.png)

3. Give your function a name e.g. 'LambdaSNSTest'. There will already be default code in the Lambda Function Code section to console.log the message:
   ```js
   console.log('Loading function');

   exports.handler = function(event, context) {
     //console.log('Received event:', JSON.stringify(event, null, 2));
     var message = event.Records[0].Sns.Message;
     console.log('From SNS:', message);
     context.succeed(message);
   };
   ```

4. In the Execution Role section select 'basic execution role'. In the pop up window, enable the creation of a lambda_basic_execution role and click 'Allow'.

5. On the final Review page, in the 'Event Sources' section choose the 'Enable now' option. Then Click 'Create Function'. You should be redirected back to the Lambda Console with a confirmation messsage: 'Congratulations! Your Lambda function "LambdaSNSTest" has been successfully created and configured with SNS: LambdaTest as an event source.'
![lambda function created](https://cloud.githubusercontent.com/assets/5912647/12579947/97b24344-c423-11e5-93b8-f658b8c9db5b.png)

## Publish a message to a topic
1. Open the SNS console and select the 'Topics' tab in the left hand menu. Select the 'LambdaTest' topic created in an earlier step. Then click the blue 'Publish to Topic' button.
![Publish to topic](https://cloud.githubusercontent.com/assets/5912647/12579960/a5dd5238-c423-11e5-90df-40b3c88f7e05.png)

2. The opens the message editor. The topic ARN is the 'Amazon Resource Name' for the topic. ARNs are used to specify a resource unambiguously across all of AWS.  We don't need to worry about them for this example!

   Give your message a subject and add some text to the message body. Leave the 'Time to Live' field blank and click 'Publish Message' in the bottom right hand corner of the screen. You should be redirected back the SNS console.
![Publish message](https://cloud.githubusercontent.com/assets/5912647/12579968/c3410dec-c423-11e5-9189-3dd68fe7060c.png)
NB: Using the JSON Messsage Generator option it is possible to format messages differently for different viewing platforms. Find out more on the [AWS SNS docs](http://docs.aws.amazon.com/sns/latest/dg/PublishTopic.html).

## Viewing the output of the lambda Function
1. Open up the Cloudwatch logs. Select the 'Logs' tab in the left hand menu.
![Logs tab](https://cloud.githubusercontent.com/assets/5912647/12579987/db74a798-c423-11e5-94e4-86965a9c8d82.png)

2. Click on the LambdaSNSTest option and click on the first Log Stream. It will take you to the log output from the SNS message that we published!
![Log stream](https://cloud.githubusercontent.com/assets/5912647/12579999/ff48d928-c423-11e5-9b02-45b7ecc7b1d4.png)

   ![Log stream output](https://cloud.githubusercontent.com/assets/5912647/12580016/18dc1f76-c424-11e5-8d27-ecd4f1ae68e0.png)
