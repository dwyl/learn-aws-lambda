
# Example Lambda App: Notepad

In this micro-tutorial we are going to build a little app
that allows us to take notes and save them to Amazon S3
via an AWS Lambda Function (*available from AWS API Gateway*).

### Pre-requisites

This mini-tutorial expects you to have the following:

+ Amazon Web Services (*AWS*) Account: http://aws.amazon.com/
+ *Basic* Node.js/JavaScript Knowledge

Everything else will be covered step-by-step!

## *How*?

1. *Login* to **AWS Console** and go to S3

![lambda-01-dashboard-select-s3](https://cloud.githubusercontent.com/assets/194400/12650770/fd48737c-c5db-11e5-861c-9139edac6e63.png)

2. If you don't already have a "*Bucket*" on S3, create one now.
Then, uplad the `notes.html` file into the bucket.
