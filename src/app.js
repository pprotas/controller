import WebSocket from 'ws';
import * as tlogic from './services/TrafficLogic.js';
import * as cservice from './services/CommunicationService.js';

const wss = new WebSocket.Server({
  port: 8080
});

wss.on('connection', (ws) => {
  cservice.init(ws);

  ws.on('message', (data) => {
    var states = tlogic.performLogic(data);
    cservice.sendStates(states, ws);
  });
});