## Node.js traffic controller
Used in combination with [the simulation](https://github.com/pprotas/simulation)

### Prerequisites
* Node v13 (install using nvm)

### Installing:
1. Pull
2. `npm install`

### Running:
`npm start`

### Cool optional stuff:
* Use Docker:
  1. `docker image build -t controller .` from project root
  2. `docker container run --rm -it -p 8080:8080 controller`

### Cool VSCode stuff:
* Install [jshint extension for VSC](https://marketplace.visualstudio.com/items?itemName=dbaeumer.jshint)
* VSCode will automatically try to attach to the NodeJS process for debugging
  * If it doesn't: You can use the 'Attach to process' Run Configuration