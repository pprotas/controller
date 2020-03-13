import * as jsonfile from 'jsonfile';
import Lane from '../interfaces/Lane';
import LightColors from '../enums/LightColors';
import State from '../classes/State';
import ColorForLane from '../classes/ColorForLane';

const phasesFile = `${process.cwd()}/public/json/phases.json`;
const initFile = `${process.cwd()}/public/json/init.json`;

export async function getPhases() {
  return await jsonfile.readFile(phasesFile);
}

export async function getPhaseForLane(lane: Lane) {
  var phases = await getPhases();
  for (var property in phases) {
    if (property === lane.id) {
      return phases[property];
    }
  }
}

export async function getInit(): Promise<State<Lane>> {
  var jsonObject = await jsonfile.readFile(initFile);
  return new State(ColorForLane, jsonObject);
}


// Haalt alle mogelijke groene lichten op, dit betekent niet dat deze lichten ook daadwerkelijk groen moeten worden.
export async function applyPhase(lane: Lane): Promise<State<ColorForLane>> {
  var phase = await getPhaseForLane(lane);
  var init = await getInit();

  Object.values(init).forEach(lane => {
    if(phase.includes(lane.id))
      lane.value = LightColors.Green;
  });

  return <State<ColorForLane>>init;
}