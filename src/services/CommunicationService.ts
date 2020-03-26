import WebSocket from 'ws';
import JSONService from './JsonService';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import LaneWithValue from '../classes/LaneWithValue';
import LightColors from '../enums/LightColors';

export default class CommunicationService {
  private static ws: WebSocket;
  public static lastState: State<LaneWithValue> = new State();
  public static currentState: State<LaneWithValue> = new State();

  static async init(ws: WebSocket) {
    this.ws = ws;
    var state = await JSONService.getInit();
    this.sendStates(<State<LaneWithColor>>state);
  }

  static sendLastStateAs(color: LightColors) {
    this.sendStates(<State<LaneWithColor>>this.lastState.toStateWithColor(color));
  }

  static sendCurrentStateAs(color: LightColors) {
    if(this.currentState.count === 0){
      this.currentState = this.lastState;
    }
    this.sendStates(<State<LaneWithColor>>this.currentState.toStateWithColor(color));
  }

  static sendStates(state: State<LaneWithColor>) {
    this.ws.send(JSON.stringify(state.getStateSortedAlphabetically().toJson()));
  }
}