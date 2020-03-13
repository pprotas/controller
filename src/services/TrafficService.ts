import * as jservice from './JsonService';
import Lane from '../interfaces/Lane';
import CarsForLane from '../classes/CarsForLane';
import State from '../classes/State';
import ColorForLane from '../classes/ColorForLane';

export async function performLogic(carsState: State<CarsForLane>): Promise<State<ColorForLane>> {
  var lane: Lane | null = await findBusiestLane(carsState);

  if(lane){
    var possibleLightsState: State<ColorForLane> = await jservice.applyPhase(lane);
    
    // Hier komt de logica om de werkelijke gewenste state te maken.
    // Houd rekening met:
    //  - Lichten waar geen auto staat moeten niet op groen
    //  - Oversteekplaatsen voor fietsen en voetgangers moeten niet altijd op groen (alleen als er iemand daar staat, op een timer)
    //  - Bussen hebben voorrang (implementeer dit in de simulatie?)
    //  - Auto's die lang wachten krijgen voorrang (implementeer dit in de simulatie?)
    
    return possibleLightsState;
  }
  
  return await jservice.getInit();
}

// Looks at all the {key, value} pairs in state and returns the biggest as a Lane.
async function findBusiestLane(carsState: State<CarsForLane>): Promise<CarsForLane | null> {
  var highest = Object.values(carsState).find(lane => lane.value === Math.max.apply(Math, Object.values(carsState).map(value => value.value)));
  if (highest) {
    return new CarsForLane(highest.id, highest.value);
  }
  return null;
}
