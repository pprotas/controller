FROM node:13
EXPOSE 8080
WORKDIR /app
COPY package.json /app
COPY /src /app
RUN ls .
RUN npm install
CMD npm start