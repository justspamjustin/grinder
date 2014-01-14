
/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');

var app = express();

app.get(/.+\..+/, function (req, res, next) {
  var index = '';
  try {
     index = fs.readFileSync(__dirname + req.url);
     res.setHeader('Content-Type', 'text/plain');
     res.setHeader('Content-Length', index.length);
  } catch (e) {
    res.send(404);
  }
  res.end(index);
});

app.get(/.*/, function (req, res, next) {
  var index = fs.readFileSync(__dirname + '/index.html');
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', index.length);
  res.end(index);
});

var port = 3000;
app.listen(port);
console.log('Listening on port' + port);
