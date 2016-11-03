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

So far so good and your have successfully dockerized your webservice.

## Step 3: Fine tune your development environment

You must have noticed that you need to build the docker image every time you make a change in the project file - effectively `change > stop > build > start` cycle - which is annoying and slows down your pace of development.

First, we will comment out the `ADD . /app` in the Dockerfile like this:

```javascript
FROM alpine
RUN apk update && apk upgrade
RUN apk add nodejs
RUN npm install express

WORKDIR /app
#ADD . /app
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
```

And make the changes in the server.js (just change the string Hello to Hi) and without building, we will stop the docker container and start with the following command.

```bash
docker run -p5000:3000 -v $PWD:/app -d node-test
```

So, we have added the volume which is the current directory and mapped it to the /app directory in the docker container.

And you will see the change is reflected without building it again. So, it became: `change > stop  > start` cycle (the build step is gone).

Now, lets install `nodemon`:

```bash
$ npm install nodemon
```

Then, add the nodemon in the npm install line of the Dockerfile:

```bash
$ cat Dockerfile

FROM alpine
RUN apk update && apk upgrade
RUN apk add nodejs
RUN npm install express nodemon

WORKDIR /app
#ADD . /app
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
```

Next, use the nodemon instead of node in the `start` line of package.json:

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
    "start": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.13.3"
  }
}
```

Now, for once run the stop > build > run cycle. And then if you change the file server.js - you do not need to do the stop > build > run cycle.

So, now you are in a better productive development environment.

## Step 4: Push your docker images

Till now the repository was local. Now, we will push our docker image to the public docker repository. For that, you need to create an account in dockerhub.com. My account in dockerhub is onlydevelop. So, all examples will be with that name.

First, you need to see the list of images:

```bash
$ docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
node-test                     latest              ceb718e9ce8b        6 days ago          43.39 MB
```

Then, you tag the image and see if the image is properly tagged:

```bash
$ docker tag ceb718e9ce8b onlydevelop/node-test:latest
$ docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
node-test                     latest              ceb718e9ce8b        6 days ago          43.39 MB
onlydevelop/node-test         latest              ceb718e9ce8b        6 days ago          43.39 MB
```
Next, you login and push your docker image to dockerhub:

```bash
$ docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: onlydevelop
Password:
Login Succeeded
$ docker push onlydevelop/node-test
The push refers to a repository [docker.io/onlydevelop/node-test]
01ae0e045d3d: Pushed
15784ea9704c: Pushed
37a679f0fad0: Pushed
3cccad12f85b: Pushed
011b303988d2: Mounted from library/alpine
latest: digest: ...
```

Now, to test it, remove your existing docker images and pull from the repo:

```bash
$ docker rmi -f ceb718e9ce8b
...
$ docker run -p5000:3000 -v $PWD:/app -d onlydevelop/node-test
Unable to find image 'onlydevelop/node-test:latest' locally
latest: Pulling from onlydevelop/node-test
...
c7795799ecc7e618
```

So, now your image is pulled from public dockerhub and run in your local machine.

## Step 5: Running your service in a kubectl cluster

As a pre-requisite, we want to create an image where the node-js source is bundled within the image.

To do that, we will uncomment the `ADD . /app` line in Dockerfile:

```bash
$ cat Dockerfile

FROM alpine
RUN apk update && apk upgrade
RUN apk add nodejs
RUN npm install express nodemon

WORKDIR /app
ADD . /app
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
```
Then, build and push with a version number:

```bash
$ docker build -t node-test:0.1 .
Sending build context to Docker daemon 9.868 MB
Step 1 : FROM alpine
 ---> baa5d63471ea
Step 2 : RUN apk update && apk upgrade
 ---> Using cache
 ---> 947cf5948524
...

$ docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
node-test                     0.1                 326a7eca6110        52 minutes ago      51.18 MB

$ docker tag 326a7eca6110 onlydevelop/node-test:0.1
[14:56]~/work/anvil/node/docker-node:master ✗ $ docker images
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
node-test                     0.1                 326a7eca6110        53 minutes ago      51.18 MB
onlydevelop/node-test         0.1                 326a7eca6110        53 minutes ago      51.18 MB

$ docker login
...

$ docker push onlydevelop/node-test:0.1
...
```

Now, we want to test our service in a minikube/kubectl cluster locally. Please check the documentation how can you install minikube/kubectl locally in your machine.

When you are done, first you need to start minikube:

```bash
$ minikube start
There is a newer version of minikube available (v0.12.2).  Download it here:
https://github.com/kubernetes/minikube/releases/tag/v0.12.2
To disable this notification, add WantUpdateNotification: False to the json config file at /Users/dbhowmik/.minikube/config
(you may have to create the file config.json in this folder if you have no previous configuration)
Starting local Kubernetes cluster...
Kubectl is now configured to use the cluster.
```

You may start the kubectl dashboard using:

```bash
$ minikube dashboard
Opening kubernetes dashboard in default browser...
```

Now, we will start a pod as a single instance of our image:

```bash
$ kubectl run node-test --image=onlydevelop/node-test:0.1 --port=3000
deployment "node-test" created
$ kubectl get pods
NAME                        READY     STATUS    RESTARTS   AGE
node-test-253544039-omvfj   1/1       Running   0          1m
```

Now, we need to expose it as a service so that it can be used from outside:

```bash
$ kubectl expose deployment node-test --type=NodePort
service "node-test" exposed
$ kubectl get services
NAME         CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
kubernetes   10.0.0.1     <none>        443/TCP    10d
node-test    10.0.0.23    <nodes>       3000/TCP   1m
```

The `--type` for minikube supports `NodePort` only.

Now, we need to know how to get the URL where the service is exposed:

```bash
$ minikube service node-test --url                 
http://192.168.99.100:31815
```

So, now we can use the URL to test our exposed service:

```bash
$ curl $(minikube service node-test --url)/user/dipanjan              
Hello dipanjan from node-test-253544039-omvfj
```

Great! That means, the service is exposed properly for single instance.

Now, let us delete this provision:

```bash
$ kubectl delete service,deployment node-test
service "node-test" deleted
deployment "node-test" deleted
```

OK. Next, let us run this in a cluster, which is very easy.

Let us create a cluster of 3 replics(note now there are 3 pods):

```bash
$ kubectl run node-test --image=onlydevelop/node-test:0.1 --port=3000 --replicas=3
deployment "node-test" created
$ kubectl get pods
NAME                        READY     STATUS    RESTARTS   AGE
node-test-253544039-gy49t   1/1       Running   0          49s
node-test-253544039-ktx5q   1/1       Running   0          49s
node-test-253544039-pcm4v   1/1       Running   0          49s
```

Now, we will once again expose the service:

```bash
$ kubectl expose deployment node-test --type=NodePort                
service "node-test" exposed

$ kubectl get services                                           
NAME         CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
kubernetes   10.0.0.1     <none>        443/TCP    10d
node-test    10.0.0.163   <nodes>       3000/TCP   6s

$ minikube service node-test --url                        
http://192.168.99.100:32062
```

Now, if you run the same curl command multiple times you will response may come from different pods:

```bash
$ curl $(minikube service node-test --url)/user/db               
Hello db from node-test-253544039-gy49t

$ curl $(minikube service node-test --url)/user/db
Hello db from node-test-253544039-pcm4v

curl $(minikube service node-test --url)/user/db
Hello db from node-test-253544039-ktx5q
```

This shows now your service is deployed in a load balanced cluster and any one of the host may respond to your request (note the changes in the hostname part after `from`).



Finally, if you want to cleanup your environment:

```bash
$ kubectl delete service,deployment node-test
service "node-test" deleted
deployment "node-test" deleted

$ minikube stop
Stopping local Kubernetes cluster...
Machine stopped.
```
