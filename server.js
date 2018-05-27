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

app.get('/user/:id', function (req, res) {
  res.send('Hello ' + req.params.id + ' from ' + hostname);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
