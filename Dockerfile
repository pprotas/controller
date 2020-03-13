FROM node:13
EXPOSE 8080
WORKDIR /app
COPY /src /app
RUN npm install
CMD npm start