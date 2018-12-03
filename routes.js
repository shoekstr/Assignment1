// Define all the handlers
var handlers = {};

// Sample handler
handlers.sample = function(data,callback){
    callback(406,{'name':'sample handler'});
};

// Not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

// Define the request router
var router = {
  'sample' : handlers.sample,
  'notFound': handlers.notFound
};

module.exports = router
