import * as WebSocket from 'ws';
import * as jservice from './JsonService';
import State from '../classes/State';
import ColorForLane from '../classes/ColorForLane';

export async function init(ws: WebSocket) {
  var state: State<ColorForLane> = await jservice.getInit();
  await sendStates(state, ws);
}

export async function sendStates(state: State<ColorForLane>, ws: WebSocket) {
  ws.send(JSON.stringify(state.toJson()));
}