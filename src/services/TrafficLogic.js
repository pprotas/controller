import * as jservice from './JsonService.js';

export async function performLogic(carsPerLane) {
  var lane = await findBusiestLane(carsPerLane);
  var possibleState = await jservice.applyPhase(lane);

  // Hier komt de logica om de werkelijke gewenste state te maken.
  // Houd rekening met:
  //  - Lichten waar geen auto staat moeten niet op groen
  //  - Oversteekplaatsen voor fietsen en voetgangers moeten niet altijd op groen (alleen als er iemand daar staat, op een timer)
  //  - Bussen hebben voorrang (implementeer dit in de simulatie?)
  //  - Auto's die lang wachten krijgen voorrang (implementeer dit in de simulatie?)

  return state;
}

async function findBusiestLane(stateObject) {
  return Object.keys(stateObject).find(key => stateObject[key] === Math.max.apply(Math, Object.values(stateObject)));
}
