import WebSocket from 'ws';
import * as tlogic from './src/services/TrafficLogic.js';
import * as cservice from './src/services/CommunicationService.js';


const wss = new WebSocket.Server({
  port: 8080
});

wss.on('connection', async (ws) => {
  await cservice.init(ws);

  ws.on('message', async (data) => {
    var carsPerLane = await JSON.parse(data);
    var states = await tlogic.performLogic(carsPerLane);
    cservice.sendStates(states, ws);
  });
});