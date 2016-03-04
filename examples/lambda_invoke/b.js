exports.handler = function(event, context) {
  console.log('b executed');
  context.succeed('great success');
};
