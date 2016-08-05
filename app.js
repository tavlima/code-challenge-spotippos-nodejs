'use strict';

global.apiRequire = function(name) {
  return require(__dirname + '/api/' + name);
};

// NPM modules
var restify = require('restify');
var SwaggerRestify = require('swagger-restify-mw');
var Bunyan = require('bunyan');

// Local modules
var database = require('./db');
var config = require('./config');


// Logger
var logger = new Bunyan({
  name: 'spotippos',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    }
  ],
  serializers: {
    req: Bunyan.stdSerializers.req,
    res: restify.bunyan.serializers.res
  }
});


// Restify app
var app = restify.createServer({
  name: 'spotippos',
  log: logger
});

module.exports = app; // for testing


// Logger middleware
app.use(restify.requestLogger());

// CORS middleware
app.use(restify.CORS());

// Gzip middleware
app.use(restify.gzipResponse());


// Swagger
var swaggerConfig = {
  appRoot: __dirname // required config
};

SwaggerRestify.create(swaggerConfig, function(err, swaggerRestify) {
  if (err) { throw err; }

  swaggerRestify.register(app);

  app.listen(config.env.PORT);
});
