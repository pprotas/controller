const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  setTimeout(function () {
    sendStates(ws);
  }, 3000);
});

ws.on('message', function incoming(data) {
  setTimeout(function () {
    console.log('recieved data:');
    console.log(JSON.parse(data));
    sendStates(ws);
  }, 3000);
});

function sendStates(ws) {
  var json = {
    A1: Math.floor(Math.random() * 6) + 1,
    A2: Math.floor(Math.random() * 6) + 1,
    A3: Math.floor(Math.random() * 6) + 1,
    A4: Math.floor(Math.random() * 6) + 1,
    AB1: Math.floor(Math.random() * 6) + 1,
    AB2: Math.floor(Math.random() * 6) + 1,
    B1: Math.floor(Math.random() * 6) + 1,
    B2: Math.floor(Math.random() * 6) + 1,
    B3: Math.floor(Math.random() * 6) + 1,
    B4: Math.floor(Math.random() * 6) + 1,
    B5: Math.floor(Math.random() * 6) + 1,
    BB1: Math.floor(Math.random() * 6) + 1,
    C1: Math.floor(Math.random() * 6) + 1,
    C2: Math.floor(Math.random() * 6) + 1,
    C3: Math.floor(Math.random() * 6) + 1,
    D1: Math.floor(Math.random() * 6) + 1,
    D2: Math.floor(Math.random() * 6) + 1,
    D3: Math.floor(Math.random() * 6) + 1,
    E1: Math.floor(Math.random() * 6) + 1,
    E2: Math.floor(Math.random() * 6) + 1,
    EV1: Math.floor(Math.random() * 6) + 1,
    EV2: Math.floor(Math.random() * 6) + 1,
    EV3: Math.floor(Math.random() * 6) + 1,
    EV4: Math.floor(Math.random() * 6) + 1,
    FF1: Math.floor(Math.random() * 6) + 1,
    FF2: Math.floor(Math.random() * 6) + 1,
    FV1: Math.floor(Math.random() * 6) + 1,
    FV2: Math.floor(Math.random() * 6) + 1,
    FV3: Math.floor(Math.random() * 6) + 1,
    FV4: Math.floor(Math.random() * 6) + 1,
    GF1: Math.floor(Math.random() * 6) + 1,
    GF2: Math.floor(Math.random() * 6) + 1,
    GV1: Math.floor(Math.random() * 6) + 1,
    GV2: Math.floor(Math.random() * 6) + 1,
    GV3: Math.floor(Math.random() * 6) + 1,
    GV4: Math.floor(Math.random() * 6) + 1,
  };
  console.log('sending');
  ws.send(JSON.stringify(json));
}