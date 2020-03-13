import JSONService from './JsonService';
import LaneWithPF from '../classes/LaneWithPF';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import LightColors from '../enums/LightColors';

export default class TrafficService {
  private static lastStateWithPF: State<LaneWithPF> = new State();
  private static lastStateWithColor: State<LaneWithColor> = new State();

  static async performLogic(currentStateWithPF: State<LaneWithPF>): Promise<State<LaneWithColor>> {
    if (this.lastStateWithPF === currentStateWithPF) {
      return this.lastStateWithColor; // If the state is the same as last cycle, throw this cycle away
    }
    var lanesToBeReviewed = new State<LaneWithPF>(LaneWithPF);

    currentStateWithPF.getAllLaneValues().forEach((laneWithPF, index) => {
      if (laneWithPF.value > 0) { // Only look at lanes with a valid priority
        lanesToBeReviewed.addLane(currentStateWithPF[index]);

        if (this.lastStateWithPF && this.lastStateWithPF[index] === laneWithPF) {
          laneWithPF.value += 1; // Add bonus priority if a car is waiting a long time. (maybe exponential scale?)
        }
        // If it's a bus or pedestrian crossing, add bonus priority. (maybe exponential scale?) (to be implemented)
      }
    });

    this.lastStateWithPF = currentStateWithPF;

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
        if (lanesToTurnGreen.getAllLaneValues()
          .every(lane => {
            var phase = JSONService.getPhaseForLane(lane);
            if (phase)
              return Object.values(phase).includes(currentLaneForReview.id);
            return false;
          }))
          lanesToTurnGreen.addLane(new LaneWithColor(currentLaneForReview.id, LightColors.Green)); // If yes, this means that there are no crossings and the lane is safe to go green.

      }

      if (lanesToTurnGreen.count == 4) break;

      lanesToBeReviewed.removeLane(i); // Remove the lane since it's been fully reviewed now.
    }

    if (lanesToTurnGreen.count > 0) {
      return lanesToTurnGreen;
    }
    return <State<LaneWithColor>>await JSONService.getInit();
  }
}