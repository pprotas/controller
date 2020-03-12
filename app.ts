import * as WebSocket from 'ws';
import * as tlogic from './src/services/TrafficService';
import * as cservice from './src/services/CommunicationService';

const wss = new WebSocket.Server({
  port: 8080
});

wss.on('connection', async (ws) => {
  await cservice.init((ws as WebSocket));

  ws.on('message', async (data) => {
    var carsPerLane = await JSON.parse(data.toString());
    var states = await tlogic.performLogic(carsPerLane);
    cservice.sendStates(states, (ws as WebSocket));
  });
});