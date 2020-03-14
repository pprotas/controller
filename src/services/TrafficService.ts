import JSONService from './JsonService';
import LaneWithPF from '../classes/LaneWithPF';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import CombinedLanesWithPF from '../classes/CombinedLanesWithPF';

export default class TrafficService {
  private static lastStateWithPF: State<LaneWithPF> = new State();
  private static lastStateWithColor: State<LaneWithColor> = new State();

  static async performLogic(currentStateWithPF: State<LaneWithPF>): Promise<State<LaneWithColor>> {
    if (this.lastStateWithPF === currentStateWithPF) {
      return this.lastStateWithColor; // If the state is the same as last cycle, throw this cycle away
    }
    var lanesToBeReviewed = new State<CombinedLanesWithPF>();
    var lanesToBeCombined = await JSONService.getCombinations();

    var currentLanesWithPF = <LaneWithPF[]>currentStateWithPF.getAllLaneValues()
    var combinedCurrentLanesWithPF: LaneWithPF[] = [];
    // Combine all the lanes
    currentLanesWithPF.forEach(lane => {
      if (Object.keys(lanesToBeCombined).includes(lane.id)) {
        var combinations = lanesToBeCombined[lane.id]; // The combinations for this specific lane
        var partners: LaneWithPF[] = [<LaneWithPF>lane]; // Make an array with all the partners, and add the current lane to it
        combinations['partners'].forEach((laneId: string) => {
          var value = currentLanesWithPF.find(lane => lane.id === laneId)?.value ?? 0;
          partners.push(new LaneWithPF(laneId, value));
        });
        if (!combinedCurrentLanesWithPF.some(lane => lane.id === combinations['newId']))
          combinedCurrentLanesWithPF.push(new CombinedLanesWithPF(combinations['newId'], ...partners));
      }
      else combinedCurrentLanesWithPF.push(lane);
    });

    //Add only lanes with a positive value to be reviewed
    combinedCurrentLanesWithPF.forEach(lane => {
      if (lane.value > 0) lanesToBeReviewed.addLane(<CombinedLanesWithPF>lane);
    });

    this.lastStateWithPF = currentStateWithPF;

    var lanesToTurnGreen = new State<LaneWithPF>();

    lanesToBeReviewed = lanesToBeReviewed.getSortedState();

    for (var i = 0; i < lanesToBeReviewed.count; i++) {
      // Each loop 'reviews' a lane
      var currentLaneForReview: CombinedLanesWithPF = lanesToBeReviewed[i];

      if (!currentLaneForReview) continue; // Go to the next iteration if the lane is undefined

      // If lanesToTurnGreen is empty it means that we are in the first iteration 
      if (lanesToTurnGreen.isEmpty()) {
        lanesToTurnGreen.addLane(currentLaneForReview); // So we add the most prioritized lane
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
          lanesToTurnGreen.addLane(currentLaneForReview); // If yes, this means that there are no crossings and the lane is safe to go green.
      }

      if (lanesToTurnGreen.count == 4) break;

      lanesToBeReviewed.removeLane(i); // Remove the lane since it's been fully reviewed now.
    }

    // Split all the CombinedLanesWithPF here into solo lanes. (TBI)

    var x = lanesToTurnGreen.getSplitUpState();
    return lanesToTurnGreen.count ? x : <State<LaneWithColor>>await JSONService.getInit();
  }
}