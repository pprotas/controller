import * as WebSocket from 'ws';
import TrafficService from './services/TrafficService';
import CommunicationService from './services/CommunicationService';
import State from './classes/State';
import LaneWithPF from './classes/LaneWithPF';

const wss = new WebSocket.Server({
  port: 8080
});

wss.on('connection', async (ws: WebSocket) => {
  await CommunicationService.init(ws);

  ws.on('message', async (data: string) => {
    var carsState = new State(LaneWithPF, await JSON.parse(data));
    var lightsState = await TrafficService.performLogic(carsState);
    CommunicationService.sendStates(lightsState, ws);
  });
});