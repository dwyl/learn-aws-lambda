# Versioning and Aliasing Lambda Functions
Multiple versions of a Lambda function can be running at the same time on AWS. Each one has a unique ARN. This allows different versions to be used in different stages of the development workflow e.g. development, beta, staging, production etc. Versions are immutable.

An alias is a pointer to a specific Lambda function version. Aliases are however mutable and can be changed to point to different versions. For example you might have two aliases 'DEV' and 'PROD', standing for 'development' and 'production' respectively. Event sources such as S3 buckets, DynamoDB tables or SNS topics can be configured with a Lambda function alias so that the ARN of the specific version doesn't need to be updated every time in the event source mapping. When new versions are upgraded to production, only the alias needs to be changed and the event source will automatically point to the correct version. This workflow also enables easy rollbacks to previous versions.

## Versioning
When you create a Lambda function e.g. 'helloworld', its version is automatically set to `$LATEST`. The version is the last part of the Lambda function's ARN:
```bash
arn:aws:lambda:aws-region:acct-id:function:helloworld:$LATEST
```

The `$LATEST` version is mutable i.e. if a Lambda function is updated either in the console or using the cli, the code in the `$LATEST` version is updated.

You can also _publish_ a new version from the `$LATEST` version. The ARN of the published version will have the version number replaced: e.g. for Version 1:
```bash
arn:aws:lambda:aws-region:acct-id:function:helloworld:1
```

Published versions are immutable so if you want to change any part of the code or configuration, you have to modify `$LATEST` and then publish a new version. If the `$LATEST` version is not changed, then a new version cannot be published.

## Aliasing
An alias can be created for an existing Lambda function. The alias and lambda function have different ARNS as they are both unique AWS resources.

Using aliases means that calling event source doesn't have to know the specific Lambda function version the alias is pointing to. It enables:
* new versions to easily be promoted or rolled back (aliases can easily be mapped to different function versions)
* easier event source mappings - more control over which versions of your function are used with specific event sources in your development environment

Walkthrough of implementing [versioning](http://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases-walkthrough1.html) and [aliasing](http://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases-walkthrough1.html) using the AWS CLI on the AWS Lambda docs.
