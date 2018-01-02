# Serverless Starter

A boilerplate for new Serverless Projects.  This is full of useful examples and we add more on a regular basis.

## Install

Make sure you have the [Serverless Framework](http://www.serverless.com) installed and you're using Node V4
```
npm install serverless -g
```

Install the project using Serverless:
```
serverless project install serverless-starter
```
Go into each project component and install its dependencies via npm:
```
npm install
```
Deploy your functions and endpoints:
```
serverless dash deploy
```

## Includes

This project contains the following:

* **Multi:** A Serverless module with multiple functions each containing a single endpoint
* **Single:** A Serverless module with a single function that uses multiple endpoints.
* **Optimizer Plugin:**  Each function is automatically optimized via the [serverless-optimizer-plugin](https://www.github.com/serverless/serverless-optimizer-plugin)
* **Templates:** Templates are used to reduce configuraton syntax
* **REST API Parameters:** The Multi/Show function endpoint gives an example of how to accept a path parameter
