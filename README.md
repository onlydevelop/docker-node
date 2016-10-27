# Simple Web Service

This example creates a simple web service development environment setup using nodejs

## Prerequisites

- You must have node js installed
- You must have `express` installed by: `npm install express`
- You must have Docker installed and running in your machine

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

## Step 2: Dockerize the Web Service

Our next step is dockerize your web service so that you can run the same in the docker containers.

Please note docker need to be installed and running in your machine.

First, create a file in the project directory named `Dockerfile`.

```bash
$ cat Dockerfile

FROM alpine
RUN apk update && apk upgrade
RUN apk add nodejs
RUN npm install express

WORKDIR /app
ADD . /app
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
```

Now, build the docker image. I have given the image name as `node-test`, you can give yours. It will take a while to build that and you need internet connection as the layers will be downloaded from the internet:

```bash
$ docker build -t node-test .
Sending build context to Docker daemon 1.269 MB
Step 1 : FROM alpine
latest: Pulling from library/alpine
...
Removing intermediate container a3ba91130f76
Successfully built 119a7159b7f0
```
Next, start the docker as a daemon and we have bound 3000 port which will respond with the docker container id(for my test it was 1ce0575a528a8..):

```bash
$ docker run -p5000:3000 -d node-test
1ce0575a528
```
And test with the same curl command as earlier:

```bash
$ curl -i localhost:5000/user/dipanjan
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 32
ETag: W/"20-CZEH+9t6idVnAKv5VPRTag"
Date: Thu, 27 Oct 2016 06:39:09 GMT
Connection: keep-alive

Hello dipanjan from 1ce0575a528
```
Note that the hostname is also same as first digits of the docker container id.

Finally, to stop the docker container use `docker stop`:

```bash
$ docker stop 1ce0575a528
1ce0575a528
```

Please note if you are making any changes in the file here you need to run the docker build command again to build the image and then run it.
