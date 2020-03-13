import * as WebSocket from 'ws';
import JSONService from './JsonService';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import ILaneWithValue from '../interfaces/ILaneWithValue';

export default class CommunicationService {
  static async init(ws: WebSocket) {
    var state: State<ILaneWithValue> = await JSONService.getInit();
    await this.sendStates(<State<LaneWithColor>>state, ws);
  }

  static async  sendStates(state: State<LaneWithColor>, ws: WebSocket) {
    ws.send(JSON.stringify(state.toJson()));
  }
}