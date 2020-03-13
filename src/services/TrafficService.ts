import * as jservice from './JsonService';
import LaneWithPF from '../classes/LaneWithPF';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import LightColors from '../enums/LightColors';


var lastStateWithPF: State<LaneWithPF>;
var lastStateWithColor: State<LaneWithColor>;



export async function performLogic(stateWithPF: State<LaneWithPF>): Promise<State<LaneWithColor>> {
  if (lastStateWithPF === stateWithPF) {
    return lastStateWithColor; // If the state is the same as last cycle, throw this cycle away
  }

  // var lanesToBeCombined: { id: string, pairs: string[], newId: string }[] = [
  //   { "id": "A2", "pairs": ["A3"], "newId": "A23" },
  //   { "id": "A3", "pairs": ["A2"], "newId": "A23" },

  //   { "id": "AB1", "pairs": ["AB2"], "newId": "AB12" },
  //   { "id": "AB2", "pairs": ["AB1"], "newId": "AB12" },

  //   { "id": "B2", "pairs": ["B3"], "newId": "B23" },
  //   { "id": "B3", "pairs": ["B2"], "newId": "B23" },

  //   { "id": "E1", "pairs": ["E2", "EV1", "EV2", "EV3", "EV4"], "newId": "E" },
  //   { "id": "E2", "pairs": ["E1", "EV1", "EV2", "EV3", "EV4"], "newId": "E" },
  //   { "id": "EV1", "pairs": ["E1", "E2", "EV2", "EV3", "EV4"], "newId": "E" },
  //   { "id": "EV2", "pairs": ["E1", "E2", "EV1", "EV3", "EV4"], "newId": "E" },
  //   { "id": "EV3", "pairs": ["E1", "E2", "EV1", "EV2", "EV4"], "newId": "E" },
  //   { "id": "EV4", "pairs": ["E1", "E2", "EV1", "EV2", "EV3"], "newId": "E" },

  //   { "id": "FF1", "pairs": ["FF2", "FV1", "FV2", "FV3", "FV4"], "newId": "F" },
  //   { "id": "FF2", "pairs": ["FF1", "FV1", "FV2", "FV3", "FV4"], "newId": "F" },
  //   { "id": "FV1", "pairs": ["FF1", "FF2", "FF2", "FV3", "FV4"], "newId": "F" },
  //   { "id": "FV2", "pairs": ["FF1", "FF2", "FV1", "FV3", "FV4"], "newId": "F" },
  //   { "id": "FV3", "pairs": ["FF1", "FF2", "FV1", "FV2", "FV4"], "newId": "F" },
  //   { "id": "FV4", "pairs": ["FF1", "FF2", "FV1", "FV2", "FV3"], "newId": "F" },

  //   { "id": "GV1", "pairs": ["GV2", "GV3", "GV4", "GF1", "GF2"], "newId": "G" },
  //   { "id": "GV2", "pairs": ["GV1", "GV3", "GV4", "GF1", "GF2"], "newId": "G" },
  //   { "id": "GV3", "pairs": ["GV1", "GV2", "GV4", "GF1", "GF2"], "newId": "G" },
  //   { "id": "GV4", "pairs": ["GV1", "GV2", "GV3", "GF1", "GF2"], "newId": "G" },
  //   { "id": "GF1", "pairs": ["GV1", "GV2", "GV3", "GV4", "GF2"], "newId": "G" },
  //   { "id": "GF2", "pairs": ["GV1", "GV2", "GV3", "GV4", "GF1"], "newId": "G" },
  // ];


  // First sort the lanes in stateWithPF by priority (to be implemented)

  var lanesToBeReviewed = new State<LaneWithPF>(LaneWithPF);

  Object.values(stateWithPF).forEach((laneWithPF, index) => {
    if (laneWithPF.value > 0) { // Only add lanes with more than 0 priority
      lanesToBeReviewed[index] = stateWithPF[index];
      lanesToBeReviewed.count++;

      if (lastStateWithPF && lastStateWithPF[index] === laneWithPF) {
        laneWithPF.value += 1; // Add bonus priority if a car is waiting a long time. (maybe exponential scale?)
      }

      // If it's a bus or pedestrian crossing, add bonus priority. (maybe exponential scale?) (to be implemented)
    }
  });

  lastStateWithPF = stateWithPF; // Remember the state for the next cycle


  var lanesToTurnGreen = new State<LaneWithColor>(LaneWithColor);

  // 1. Sort lanesToBeReviewed by priority
  // In a for loop with var index = 0 (or recursive function)
  for (var i = 0; lanesToTurnGreen.count - 1 < 4; i++) { // If lanesToTurnGreen has 4 members, stop looking
    // 2. If lanesToTurnGreen is empty, add the id of lanesToBeReviewed[index] to it and go to the next index. Remove this lane from lanesToBeReviewed.
    if (lanesToBeReviewed.count == 0)
      break; //If lanesToBeReviewed is empty, stop looking
    if (lanesToTurnGreen.count == 0) {
      lanesToTurnGreen[lanesToTurnGreen.count] = new LaneWithColor(lanesToBeReviewed[i].id, LightColors.Green);
      lanesToTurnGreen.count++;
      delete lanesToBeReviewed[i];
      lanesToBeReviewed.count--;
    }
    // 3. Else, look at the phases of lanesToBeReviewed[index]
    else {
      if(!lanesToBeReviewed) break;
      if (lanesToBeReviewed[i]) {
        var phase: [string, number[]] | undefined = await jservice.getPhaseForLane(lanesToBeReviewed[i]);
        if (phase) {
          // 4. If all of the lanes in lanesToTurnGreen are on this phase, add the id of it to the list and go to the next index. Remove this lane from lanesToBeReviewed.
          var found: boolean = false;
          var x = Object.values(lanesToTurnGreen);
          x.forEach((o, i) => {
            if (o.id == undefined) {
              delete x[i];
            }
          })
          x = x.map(o => o.id);
          Object.values(lanesToTurnGreen).forEach((_, index) => {
            if (lanesToBeReviewed[index] && Object.values(phase!).includes(Object.values(x)) && !found) {
              lanesToTurnGreen[i] = new LaneWithColor(lanesToBeReviewed[i].id, LightColors.Green);
              lanesToTurnGreen.count++;
              found = true;
            }
          });
          delete lanesToBeReviewed[i];
          continue;
        }
      }
    }
  }


  // Uncouple any combined lanes in lanesToTurnGreen. Add both of the ids to lanesToTurnGreen. (to be implemented)


  if (lanesToTurnGreen.count > 0) {
    return lanesToTurnGreen;
  }
  return <State<LaneWithColor>>await jservice.getInit();
}


// Looks at all the {key, value} pairs in state and returns the biggest as a Lane.
// async function findBusiestLane(stateWithPF: State<LaneWithPF>): Promise<LaneWithPF | null> {
//   var busiestLane = Object.values(stateWithPF).find(lane => lane.value === Math.max.apply(Math, Object.values(stateWithPF).map(value => value.value)));
//   if (busiestLane) {
//     return new LaneWithPF(busiestLane.id, busiestLane.value);
//   }
//   return null;
// }
