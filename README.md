## Node.js traffic controller
Used in combination with [the simulation](https://github.com/pprotas/simulation)
### Installing:
1. Pull
2. `npm install` from `./src/`

### Running:
`npm start`

### Cool optional stuff:
* Use Docker:
  1. `docker image build -t controller .` from project root
  2. `docker container run --rm -it -p 8080:8080 controller`

### Cool VSCode stuff:
* Install [jshint extension for VSC](https://marketplace.visualstudio.com/items?itemName=dbaeumer.jshint)
* Launch the debugger after running `npm debug`, VSCode will automatically restart the debugging session after you make a change