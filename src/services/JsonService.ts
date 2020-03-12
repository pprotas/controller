import * as jsonfile from 'jsonfile';

const phasesFile = `${process.cwd()}/public/json/phases.json`;
const initFile = `${process.cwd()}/public/json/init.json`;

export async function getPhases() {
  return await jsonfile.readFile(phasesFile);
}

export async function getPhaseForLane(lane: any) {
  var phases = await getPhases();
  for(var property in phases){
    if(property === lane){
      return phases[property];
    }
  }
}

export async function getInit() {
  return await jsonfile.readFile(initFile);
}

// Haalt alle mogelijke groene lichten op, dit betekent niet dat deze lichten ook daadwerkelijk groen moeten worden.
export async function applyPhase(lane: any) {
  var phase = await getPhaseForLane(lane);
  var init = await getInit();

  for(var property in init){
    if(phase.includes(property)){
      init[property] = 2;
    } 
  }

  return init;
}