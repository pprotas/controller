import * as WebSocket from 'ws';
import * as jservice from './JsonService';

export async function init(ws: WebSocket) {
  var state = await jservice.getInit();
  await sendStates(state, ws);
}

export async function sendStates(state: any, ws: WebSocket) {
  await ws.send(JSON.stringify(state));
}