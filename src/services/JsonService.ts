import * as jsonfile from 'jsonfile';
import ILaneWithValue from '../interfaces/ILaneWithValue';
import LightColors from '../enums/LightColors';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import LaneWithValue from '../classes/LaneWithValue';

const phasesFile = `${process.cwd()}/public/json/phases.json`;
const initFile = `${process.cwd()}/public/json/init.json`;

export async function getPhases() {
  return await jsonfile.readFile(phasesFile);
}

export async function getPhaseForLane(lane: ILaneWithValue): Promise<[string, number[]] | undefined> {
  var phases = await getPhases();
  for (var property in phases) {
    if (property === lane.id) {
      return phases[property];
    }
  }
  return undefined;
}

export async function getInit(): Promise<State<LaneWithValue>> {
  var jsonObject = await jsonfile.readFile(initFile);
  var x = new State<LaneWithValue>(LaneWithValue, jsonObject);
  return x;
}


// Haalt alle mogelijke groene lichten op, dit betekent niet dat deze lichten ook daadwerkelijk groen moeten worden.
export async function applyPhase(lane: ILaneWithValue): Promise<State<LaneWithColor>> {
  var phase = await getPhaseForLane(lane);
  var init = await getInit();

  Object.values(init).forEach(lane => {
    if(phase)
    if(phase.includes(lane.id))
      lane.value = LightColors.Green;
  });

  return <State<LaneWithColor>>init;
}