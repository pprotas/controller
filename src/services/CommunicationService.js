import jsonfile from 'jsonfile';

const initFile = `${process.cwd()}/src/json/init.json`;

export async function sendStates(ws) {
    var json = await jsonfile.readFile(initFile);
    console.log(json);
    ws.send(JSON.stringify(json));
  }