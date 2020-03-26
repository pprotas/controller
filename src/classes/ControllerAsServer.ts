import WebSocket from 'ws';
import TrafficService from '../services/TrafficService';
import CommunicationService from '../services/CommunicationService';
import TimingService from '../services/TimingService'
import State from './State';
import LaneWithPF from './LaneWithPF';

export default class ControllerAsServer {

    private wss: WebSocket.Server;

    constructor(public port: number) {
        this.wss = new WebSocket.Server({
            port: port
        });
    }

    public listen() {
        console.log(`listening on ${this.port}`);
        this.wss.on('connection', async (ws: WebSocket) => {
            await CommunicationService.init(ws);
            TimingService.startTimer();

            ws.on('message', async (data: string) => {
                var carsState = new State(LaneWithPF, await JSON.parse(data));
                CommunicationService.lastState = await TrafficService.performLogic(carsState);
                if (!CommunicationService.lastState.isEmptyState()) TimingService.carsAtIntersection = true;
            });
        });
    }
}