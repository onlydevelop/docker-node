# Simple Web Service

This example creates a simple web service development environment setup using nodejs

## Prerequisites

- You must have node js installed
- You must have `express` installed by: `npm install express`

## Step 1: Creating a simple Web Service in nodejs

Create your project directory(for me it is docker_node, you may choose yours):

```bash
$ mkdir docker_node
$ cd docker_node
```

Create the `packge.json` file with the following content:

```json
$ cat package.json

{
  "name": "HelloWorld",
  "version": "1.0.0",
  "description": "My hello world app",
  "author": "Dipanjan Bhowmik",
  "license": "ISC",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.13.3"
  }
}
```

Create the simple web service script `server.js`:

```javascript
$ cat server.js

'use strict';

const express = require('express');
var os = require("os");
var hostname = os.hostname();

// Constants
const PORT = 3000;

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
```
Run the Web Service using `npm start`:

```bash
$ npm start

> HelloWorld@1.0.0 start
$HOME/docker-node
> node server.js

Running on http://localhost:3000
```

Now, test it using curl from another terminal. Notice my hostname `cirrus` is shown for the second request:

```bash
$ curl -i localhost:3000

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 12
ETag: W/"c-8O9wgeFTmsAO9bdhtPsBsw"
Date: Thu, 27 Oct 2016 06:12:03 GMT
Connection: keep-alive

Hello world

$ curl -i localhost:3000/user/dipanjan

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 26
ETag: W/"1a-tXiFts4+U6jA7QRVqjOrOQ"
Date: Thu, 27 Oct 2016 06:12:14 GMT
Connection: keep-alive

Hello dipanjan from cirrus
```

Congratualations! Your nodejs based web service is up and running.
