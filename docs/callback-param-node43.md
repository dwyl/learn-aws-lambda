# The Callback Parameter
It used to be the case that in order to terminate a lambda function you had to use `context.succeed`, `context.fail` or `context.error`. Now that AWS Lambda supports node v4.3, we are able to make use of the callback parameter which allows us to explicitly return information back to the caller.

The callback takes two parameters taking the following form `callback(Error error, Object result);` Let's walk through a quick example of how to implement the callback.

Let's write a simple Lambda function that returns some text after it's been invoked through an SNS topic:

```
exports.handler = function (event, context, callback) {
  const message = JSON.parse(event.Records[0].Sns.Message);
  const text = message.content.text;
  // checking that the text exists
  if (text && text.length) {
    return callback(null, `Here is some text: ${text}`);
  } else {
    // if no text was found return this message
    return callback(null, 'No text was found');
  }
}
```
