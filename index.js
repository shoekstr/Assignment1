const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const fs = require('fs')

const config = require('./config')
const routes = require('./routes')

// Initializing HTTP Server
const httpServer  = http.createServer((req, res) => {
  unifiedServer(req, res)
})

httpServer.listen(config.httpPort, () => {
  console.log('The HTTP Server is running on port ' + config.httpPort)
})

// Initializing HTTPS Server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
})

httpsServer.listen(config.httpsPort, () => {
  console.log('The HTTPS server is running on port ' + config.httpsPort)
})

// Process Handler that is use for both http and https
const unifiedServer = (req, res) => {
  // Parse the url
  const parsedUrl = url.parse(req.url, true)

  // Get the path
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the query string as an object
  const queryStringObject = parsedUrl.query

  // Get the HTTP method
  const method = req.method.toLowerCase()

  //Get the headers as an object
  const headers = req.headers

  // Get the payload,if any
  const decoder = new StringDecoder('utf-8')
  let buffer = ''

  req.on('data', function(data) {
      buffer += decoder.write(data)
  })

  req.on('end', function() {
      buffer += decoder.end()

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      const chosenHandler = typeof(routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : routes.notFound

      // Construct the data object to send to the handler
      const data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      }

      // Route the request to the handler specified in the router
      chosenHandler(data,function(statusCode,payload){

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object'? payload : {}

        // Convert the payload to a string
        const payloadString = JSON.stringify(payload)

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode)
        res.end(payloadString)
        console.log("Returning this response: ",statusCode,payloadString)
      })
    })
}
