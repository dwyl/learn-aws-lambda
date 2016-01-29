console.log('Loading event');
console.log('Loading event again');

exports.handler = function(event, context) {
    context.succeed(event.key1);  // SUCCESS with message
};
