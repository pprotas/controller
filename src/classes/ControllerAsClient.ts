import WebSocket from 'ws';
import * as url from 'url';
import CommunicationService from '../services/CommunicationService';
import TimingService from '../services/TimingService'

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
            console.log(`${data}`);
        });
    }
}