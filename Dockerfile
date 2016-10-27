FROM alpine
RUN apk update && apk upgrade
RUN apk add nodejs
RUN npm install express nodemon

WORKDIR /app
#ADD . /app
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
