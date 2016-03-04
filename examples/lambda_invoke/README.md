# Invoking a Lambda from within a Lambda

Our objective is to invoke a Lambda Function from another Lambda Function.

Lambda_A invokes Lambda_B
with a `payload` containing a single parameter `name:'Alex'`.
Lambda_B replies "Hello Alex".

`Lambda_A`:
```js

```

`Lambda_B`:
```js
exports.handler = function(event, context) {
  console.log('Lambda B Received event:', JSON.stringify(event, null, 2));
  context.succeed('Hello ' + event.name);
};
```
