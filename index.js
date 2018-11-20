const http = require('http')
const https = require('https')

const fs = require('fs')

const config = require('./config')
const routes = require('./routes')

const httpServer  = http.createServer((req, res) => {
  unifiedServer(req, res)
})

httpServer.listen(config.httpPort, () => {
  console.log('The HTTP Server is running on port ' + config.httpPort)
})

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

const unifiedServer = (req, res) => {
  res.end('Hello\n')
}
