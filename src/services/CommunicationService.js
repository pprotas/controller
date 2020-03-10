import * as jservice from './JsonService.js';

export async function init(ws) {
  var state = await jservice.getInit();
  await sendStates(state, ws);
}

export async function sendStates(state, ws) {
  await ws.send(JSON.stringify(state));
}