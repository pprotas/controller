import * as WebSocket from 'ws';
import TrafficService from './services/TrafficService';
import CommunicationService from './services/CommunicationService';
import TimingService from './services/TimingService'
import State from './classes/State';
import LaneWithPF from './classes/LaneWithPF';

const wss = new WebSocket.Server({
  port: 8080
});


wss.on('connection', async (ws: WebSocket) => {
  await CommunicationService.init(ws);
  TimingService.startTimer();

  ws.on('message', async (data: string) => {
    var carsState = new State(LaneWithPF, await JSON.parse(data));
    CommunicationService.lastState = await TrafficService.performLogic(carsState);
    if(!CommunicationService.lastState.isEmptyState()) TimingService.carsAtIntersection = true;
  });
});