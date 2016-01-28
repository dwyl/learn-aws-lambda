exports.handler = function(event, context) {
  context.succeed(event.key1 + ' ' + event.key2);
};
