import WebSocket from 'ws';
import CommunicationService from '../services/CommunicationService';
import TimingService from '../services/TimingService'
import TrafficService from '../services/TrafficService';

// The main controller class. Allows the user to host the controller on a port.
// Accepts incoming connections from a simulation, and handles the incoming data
export default class ControllerAsServer {

  private wss: WebSocket.Server;

  constructor(public port: number) {
    this.wss = new WebSocket.Server({
      port: port
    });
    
    // The traffic light timer will always be running in the background
    TimingService.startTimer();

    TrafficService.masterPrioState.fillEmptyLanes();
  }

  public listen() {
    console.log(`listening on ${this.port}`);
    this.wss.on('connection', (ws: WebSocket) => {
      CommunicationService.ws = ws;

      ws.on('message', (data: string) => {
        console.log(data);
        TimingService.handle(data);
      });
    });
  }
}