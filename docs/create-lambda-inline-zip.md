# 'HELLO WORLD!' Example (.ZIP)
An alternative _(and perhaps more commonly used)_ way of creating an AWS Lambda function is to write it in a text editor, zip it up and then upload it. Here's how:

1. Follow the first two steps of the previous example if you haven't already created an AWS account.

1. On the 'Select blueprint' page hit the 'skip' button because we'll be creating our own.

1. On the 'Configure Function' page give your Lambda function a name and then select the 'Upload a .ZIP file' radio button. It will then prompt you to upload a file.
  ![zip file upload](https://cloud.githubusercontent.com/assets/12450298/12537249/181e2fac-c2b2-11e5-9363-68d7505c4651.png)

1. Open up your text editor and write your Lambda function just as you would if you were writing it inline and then save it as a `.js` file:
  ![function code](https://cloud.githubusercontent.com/assets/12450298/12537413/7374470c-c2b6-11e5-8e3a-9baaa99c06aa.png)

1. Zip up this file by typing the following into the command line. The command consists of the first filename which is the zip file you want to create _(call it whatever you like .zip)_ followed by the files you want to zip up. In our example you can see the name of the `.js` file we created earlier:
   ```
   $ zip -r hello-world.zip hello-world.js
   ```
   You should now be able to see a `.ZIP` file alongside your `.js` file.

   **NOTE: If your function has any dependencies then you must include your `node_modules` file within your .ZIP file. Simply add `node_modules` after the files you wish to zip up!**

1. Go back to the 'Configure Function' page and click the 'Upload' button and select the .ZIP file you just created.

1. Next select the Lambda function handler and role. The handler is the name of the `.js` file that contains your function followed by the name of the handler you are exporting. We've selected the basic execution role just like the previous example:
  ![handler and role](https://cloud.githubusercontent.com/assets/12450298/12537454/acee35b4-c2b7-11e5-99ba-3304394f3d18.png)

1. Just like the previous example, click 'next' and if you are happy with your function click 'Create function'. Your new function should now show up in your list of AWS Lambda functions:
  ![function list](https://cloud.githubusercontent.com/assets/12450298/12537495/94d2171a-c2b8-11e5-861e-9225d3b17f28.png)
  This function can now be tested in the same way as the inline example.
