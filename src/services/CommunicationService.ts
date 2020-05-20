import WebSocket from 'ws';
import JSONService from './JsonService';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import LaneWithValue from '../classes/LaneWithValue';
import LightColors from '../enums/LightColors';

export default class CommunicationService {
  public static ws: WebSocket;
  public static currentState: State<LaneWithValue> = new State();

  // Send empty state
  static init(ws: WebSocket) {
    this.ws = ws;
    var state = JSONService.getInit();
    this.sendStates(<State<LaneWithColor>>state);
  }

  static sendCurrentStateAs(color: LightColors) {
    this.sendStates(<State<LaneWithColor>>this.currentState.toStateWithColor(color));
  }

  static sendStates(state: State<LaneWithColor>) {
    this.ws.send(JSON.stringify(state.getStateSortedAlphabetically().toJson()));
  }

  static sendStateAs(state: State<LaneWithValue>, color: LightColors) {
    this.sendStates(state.toStateWithColor(color));
  }
}