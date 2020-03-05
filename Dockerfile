FROM alpine:3.7
WORKDIR app
COPY . /app
RUN apk add --no-cache nodejs
RUN npm install
CMD node app.js