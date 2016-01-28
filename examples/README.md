
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

### 1. *Login* to **AWS Console** and Select ***S3*** from the menu:

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
