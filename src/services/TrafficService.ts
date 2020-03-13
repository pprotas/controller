import * as jservice from './JsonService';
import LaneWithPF from '../classes/LaneWithPF';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import LightColors from '../enums/LightColors';


var lastStateWithPF: State<LaneWithPF>;
var lastStateWithColor: State<LaneWithColor>;



export async function performLogic(currentStateWithPF: State<LaneWithPF>): Promise<State<LaneWithColor>> {
  if (lastStateWithPF === currentStateWithPF) {
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

  currentStateWithPF.getAllLaneValues().forEach((laneWithPF, index) => {
    if (laneWithPF.value > 0) { // Only look at lanes with a valid priority
      lanesToBeReviewed.addLane(currentStateWithPF[index]);

      if (lastStateWithPF && lastStateWithPF[index] === laneWithPF) {
        laneWithPF.value += 1; // Add bonus priority if a car is waiting a long time. (maybe exponential scale?)
      }
      // If it's a bus or pedestrian crossing, add bonus priority. (maybe exponential scale?) (to be implemented)
    }
  });

  lastStateWithPF = currentStateWithPF;

  var lanesToTurnGreen = new State<LaneWithColor>(LaneWithColor);

  for (var i = 0; i < lanesToBeReviewed.count; i++) {
    // Each loop 'reviews' a lane
    var currentLaneForReview: LaneWithPF = lanesToBeReviewed[i];

    if (!currentLaneForReview) continue; // Go to the next iteration if the lane is undefined

    // If lanesToTurnGreen is empty it means that we are in the first iteration 
    if (lanesToTurnGreen.isEmpty()) {
      lanesToTurnGreen.addLane(new LaneWithColor(currentLaneForReview.id, LightColors.Green)); // So we add the most prioritized lane
    }

    // If it's not, it means we need to find the next most prioritized lane.
    else {
      // Find the phase for the previous greenlit lane
      //var previousPhase: [string, number[]] | undefined = await jservice.getPhaseForLane(lanesToTurnGreen.pop());

      // For each lane in lanesToTurnGreen, look at the phase. The currentLaneForReview HAS to be in all of the phases.
      var laneValues = lanesToTurnGreen.getAllLaneValues()
      var canTurnCurrentLaneGreen = true;
      for (var j = 0; j < laneValues.length; j++) {
        var lane = laneValues[j];
        if (lane)
          var phase = await jservice.getPhaseForLane(lane);
        else break;
        if (!Object.values(phase!).includes(currentLaneForReview.id)) {
          canTurnCurrentLaneGreen = false;
          break;
        }
      }
      if (canTurnCurrentLaneGreen)
        lanesToTurnGreen.addLane(new LaneWithColor(currentLaneForReview.id, LightColors.Green)); // If yes, this means that there are no crossings and the lane is safe to go green.
    }

    if (lanesToTurnGreen.count == 4) break;

    lanesToBeReviewed.removeLane(i); // Remove the lane since it's been fully reviewed now.
  }

  if (lanesToTurnGreen.count > 0) {
    return lanesToTurnGreen;
  }
  return <State<LaneWithColor>>await jservice.getInit();
}

