import jsonfile from 'jsonfile';

const initFile = `${process.cwd()}/json/init.json`;

export async function init(ws) {
  var json = await jsonfile.readFile(initFile);
  await sendStates(json, ws);
}

export async function sendStates(json, ws){
  await ws.send(JSON.stringify(json));
}