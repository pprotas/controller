## Node.js traffic controller
Used in combination with [the simulation](https://github.com/pprotas/simulation)
### Installing:
1. Pull the repo
2. `npm install`
### Running:
`npm start`

### Cool optional stuff:
- Install [jshint extension for VSC](https://marketplace.visualstudio.com/items?itemName=dbaeumer.jshint)
- Use Docker:
1. `docker image build -t controller .` from project root
2. `docker container run --rm -it -p 8080:8080 controller`