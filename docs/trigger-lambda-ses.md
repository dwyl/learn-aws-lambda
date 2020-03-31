# Trigger a Lambda function when an email is received by Amazon Simple Email Service
Start by creating a blank AWS Lambda function that will be called whenever a new email comes in.

## Set up SES
For this you need your own domain, and you need to verify the domain with AWS, this can take up to 72hrs, so have a nice drink and chill out while you wait :sunglasses: :coffee:

See here for how: http://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domain-procedure.html

## Add a rule set
Click `rule sets` on the bottom left and create a new rule set with whatever name you like. If you want to have your function triggered by emails sent to any address in your domain you can leave recipient blank, else you can add the recipient you want to trigger the function.

In that rule set add an action for your Lambda function. This tells AWS to run your action when an email is received by SES.

This is all you need to do to make your function trigger from SES, but depending on what your Lambda function does, it might be kind of hard to verify that it's run (though you can look at the stats for the function to see how and when it's been run) so let's make it save the body of your email to your bucket!

## Warning before continuing
This next section is an illustration of how Lambda function can be used with SES, not a recommendation for usage.
If you set this up on your own AWS account, it's possible a SPAMer will _flood_ your Lambda and cause you to waste _loadz-a-money_ on S3 writes...
![image](https://user-images.githubusercontent.com/194400/28249477-7f486464-6a4e-11e7-983b-cc7735876ef2.png)

**$0.05 per 1,000** writes to S3 might not _sound_ like a lot, but it will add up if you consider the volume of spam sent/received. (_if you use GMail you won't realise it because Google has **amazing** filters, but an "un-protected" email address will get hundreds and a reasonably popular domain will get **thousands** of SPAM  emails **per day**_)

> Fun Fact: Over 50% of email is SPAM see: https://www.statista.com/statistics/420391/spam-email-traffic-share/
![image](https://user-images.githubusercontent.com/194400/28249544-a823d822-6a4f-11e7-9e21-791a9eba0aa6.png)

Continue with care :dollar:

## Save the email to S3
Go back to the rule set you created for your Lambda function. Add a new action to it, this one should be an S3 action, with the bucket you want to use selected. This will save the email to S3. Make sure this action is positioned **above** your Lambda function:
![ses management console - google chrome_006](https://user-images.githubusercontent.com/22300773/28177094-a0e16bfc-67f1-11e7-8676-feabc437295f.png)

This saves the email in a slightly weird way that we don't have that much control over, so we want our Lambda function to take the file written from the S3 action and process it separately.

Before this can happen you need to set up a role to give your function access to S3, for the policy of the role put something like this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "logs:CreateLogGroup",
      "Resource": "arn:aws:logs:us-east-2:YOUR-USER-ID-HERE:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "s3:*"
      ],
      "Resource": [
        "arn:aws:logs:us-east-2:271861816104:log-group:/aws/lambda/getHelloWorld:*",
        "arn:aws:s3:::YOUR-BUCKET-HERE",
        "arn:aws:s3:::YOUR-BUCKET-HERE/*"
      ]
    }
  ]
}
```

The `s3:*` property under `Action` allows all s3 functionality for any functions with this role. The last two properties under `Resource` give access to your bucket and any subdirectories within it.

In the permissions tab of your S3 bucket select "Any Authenticated AWS User" and give read and write access for object access and permission access.

(I'm sure there is a better way than this, __please__ raise an issue if you know how :pray:)

So now when we receive an email it is save to S3 and a function is triggered. Next we need we need to hook the two up so our Lambda function reads the saved file, and saves the body in a nice readable way.

## Save the body to S3 using AWS Lambda
To do this we can change our Lambda function to look like this:

```js
var AWS = require('aws-sdk');

// Make a new instance of the AWS.S3 object, telling it which signature version to use
var s3 = new AWS.S3({
  signatureVersion: 'v4'
});

exports.handler = (event, context, callback) => {
  // get the saved object from your S3 bucket
  s3.getObject({
    Bucket: YOUR-BUCKET-NAME-HERE,
    Key: 'YOUR-SUBDIRECTORY-THAT-S3-SAVES-TO/' + event.Records[0].ses.mail.messageId
  }, (err, res) => {
    // The contents of the file will be passed into the callback as res

    const params = {
      Bucket: BUCKET-YOU-WANT-TO-SAVE-TO,
      Key: FILE-NAME-YOU-WANT, 
      // res.Body is a buffer so you can call
      // "toString()" on it to make it into a string
      Body: res.Body.toString()
    };

    // this will put the file you specified in params in the bucket  
    s3.putObject(params, (err, res) => {
      // you'll either get an error or response depending on if the file
      // was added to the bucket properly 
      console.log(err, res);
      callback(null, 'Success!');
    });
  });
};
```

Check out the comments in the code to see what it does, and once you understand it, adapt it to your specific needs!

If you've put all this together, you should have an AWS set up where you can send an email to an address and the body of it is saved to a bucket!
