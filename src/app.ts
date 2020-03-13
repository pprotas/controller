import * as WebSocket from 'ws';
import * as tlogic from './services/TrafficService';
import * as cservice from './services/CommunicationService';
import State from './classes/State';
import LaneWithPF from './classes/LaneWithPF';

const wss = new WebSocket.Server({
  port: 8080
});

wss.on('connection', async (ws: WebSocket) => {
  await cservice.init(ws);

  ws.on('message', async (data: string) => {
    var carsState = new State(LaneWithPF, await JSON.parse(data));
    var lightsState = await tlogic.performLogic(carsState);
    cservice.sendStates(lightsState, ws);
  });
});