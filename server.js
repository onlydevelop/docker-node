'use strict';

const express = require('express');
var os = require("os");
var hostname = os.hostname();

// Constants
const PORT = process.env.PORT || 3000;

// App
const app = express();

app.get('/', function (req, res) {
  res.send('Hello world\n');
});

app.get('/console/:user', function (req, res) {
  var date = new Date();
  var response = `Hello ${req.params.user} from ${hostname} at ${date}\n
`;
  res.send(response);
});

app.get('/web/:user', function (req, res) {
  var date = new Date();
  var bgcolor = "#FFFFFF"

  if (/[a-f][0-9]+/.test(hostname)) {
    bgcolor = `#${hostname.slice(0, 6)}`;
  }
  var response = `<html>
  <body bgcolor="${bgcolor}">
    <h2>Hello ${req.params.user}!</h2>
    <h3>I am running on: ${hostname}</h3>
    <h3>Current time: ${date} </h3>
  </body>
</html>
`;
  res.send(response);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
