console.log('Loading event');
console.log('Loading event again');

exports.handler = function(event, context) {
    if(event.key1) {
      context.succeed(event.key1);
    } else {
      context.fail("no key1");
    }
};
