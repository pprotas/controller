import WebSocket from 'ws';
import * as url from 'url';
import TrafficService from '../services/TrafficService';
import CommunicationService from '../services/CommunicationService';
import TimingService from '../services/TimingService'
import State from './State';
import LaneWithPF from './LaneWithPF';

export default class ControllerAsServer {

    private ws: WebSocket;

    constructor(public url: url.URL) {
        this.ws = new WebSocket(url);
    }

    public listen() {
        console.log(`listening to ${this.url}`);
        this.ws.on('open', async () => {
            await CommunicationService.init(this.ws);
            TimingService.startTimer();
        });

        this.ws.on('message', async (data: string) => {
            var carsState = new State(LaneWithPF, await JSON.parse(data));
            CommunicationService.lastState = await TrafficService.performLogic(carsState);
            if (!CommunicationService.lastState.isEmptyState()) TimingService.carsAtIntersection = true;
        });
    }
}