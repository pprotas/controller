const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var latestSimState;

wss.on('connection', (ws) => {
  sendStates(ws);

  ws.on('message', (data) => {
    console.log(data);
    json = JSON.parse(data);
    if (!latestSimState) {
      performLogic(json, ws);
    }

    lastestSimState = json;

  });
});

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");
  wss.close();
});

process.once('SIGUSR2', function () {
  wss.close(function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

function sendStates(ws) {
  var json = {
    A1: 0,
    A2: 0,
    A3: 0,
    A4: 0,
    AB1: 0,
    AB2: 0,
    B1: 0,
    B2: 0,
    B3: 0,
    B4: 0,
    B5: 0,
    BB1: 0,
    C1: 0,
    C2: 0,
    C3: 0,
    D1: 0,
    D2: 0,
    D3: 0,
    E1: 0,
    E2: 0,
    EV1: 0,
    EV2: 0,
    EV3: 0,
    EV4: 0,
    FF1: 0,
    FF2: 0,
    FV1: 0,
    FV2: 0,
    FV3: 0,
    FV4: 0,
    GF1: 0,
    GF2: 0,
    GV1: 0,
    GV2: 0,
    GV3: 0,
    GV4: 0,
  };
  ws.send(JSON.stringify(json));
}

function performLogic(state, ws) {
  var highest = Math.max.apply(Math, Object.values(state));
  var key = Object.keys(state).find(key => state[key] === highest);
  console.log(key);
}

