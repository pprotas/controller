import * as WebSocket from 'ws';
import * as jservice from './JsonService';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import ILaneWithValue from '../interfaces/ILaneWithValue';

export async function init(ws: WebSocket) {
  var state: State<ILaneWithValue> = await jservice.getInit();
  await sendStates(<State<LaneWithColor>>state, ws);
}

export async function sendStates(state: State<LaneWithColor>, ws: WebSocket) {
  ws.send(JSON.stringify(state.toJson()));
}