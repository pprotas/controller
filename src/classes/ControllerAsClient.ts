import WebSocket from 'ws';
import * as url from 'url';
import CommunicationService from '../services/CommunicationService';
import TimingService from '../services/TimingService'

// Controller class used for the required communication tests. Allows the user to connect this controller to a remote server
export default class ControllerAsClient {
    private ws: WebSocket;

    constructor(public url: url.URL) {
        this.ws = new WebSocket(url);
    }

    public listen() {
        console.log(`listening to ${this.url}`);
        this.ws.on('open',  () => {
             CommunicationService.init(this.ws);
            TimingService.startTimer();
        });

        this.ws.on('message',  (data: string) => {
            console.log(`${data}`);
        });
    }
}