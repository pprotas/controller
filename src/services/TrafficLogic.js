import jsonfile from 'jsonfile';

const phasesFile = `${process.cwd()}/json/phases.json`;
const initFile = `${process.cwd()}/json/init.json`;

var latestState;

export async function performLogic(state) {
  const json = JSON.parse(state);
  var initObject = await jsonfile.readFile(initFile);

  var key = Object.keys(json).find(key => json[key] === Math.max.apply(Math, Object.values(json)));
  initObject = await setLights(initObject, 0);
  return initObject;
}

async function setLights(state, desiredLights, color) {
  var phasesObject = await jsonfile.readFile(phasesFile);

  if (color == 0) {
    if (phasesObject.hasOwnProperty(key)) {
      lights = phasesObject[key];
    }
  }

  for (var property in initObject) {
    if (greenLights.includes(property)) {
      initObject[property] = 2;
    }
  }

  return state;
}