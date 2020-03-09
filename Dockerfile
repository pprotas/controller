FROM node:13
EXPOSE 8080
WORKDIR /app
COPY config/* /app
COPY /src /app
RUN ls .
RUN npm install --only=prod
CMD npm start