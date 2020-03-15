import JSONService from './JsonService';
import LaneWithPF from '../classes/LaneWithPF';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import CombinedLane from '../classes/CombinedLane';

export default class TrafficService {
  private static lastStateWithPF: State<LaneWithPF> = new State();
  private static lastStateWithColor: State<LaneWithColor> = new State();

  static async performLogic(currentStateWithPF: State<LaneWithPF>): Promise<State<LaneWithColor>> {
    if (this.lastStateWithPF === currentStateWithPF) {
      return this.lastStateWithColor; // If the state is the same as last cycle, throw this cycle away
    }

    // Remember this state for next cycle
    this.lastStateWithPF = currentStateWithPF;

    // Combine all lanes
    var combinedCurrentLanesWithPF: LaneWithPF[] = await TrafficService.combineLanes(currentStateWithPF.getAllLanes());

    //Add only lanes with a positive value to be reviewed
    var lanesToBeReviewed = new State<LaneWithPF>();

    combinedCurrentLanesWithPF.forEach(lane => {
      if (lane.value > 0) lanesToBeReviewed.addLane(lane);
    });

    // The lanes with the highest values and no crossings can turn green
    var lanesToTurnGreen = await TrafficService.reviewLanes(lanesToBeReviewed);
    lanesToTurnGreen = lanesToTurnGreen.getSplitUpState();
    await lanesToTurnGreen.fillEmptyLanes();

    return lanesToTurnGreen.count ? lanesToTurnGreen.toStateWithColor() : <State<LaneWithColor>>await JSONService.getInit();
  }

  static async combineLanes(lanes: LaneWithPF[]) {
    var lanesToBeCombined = await JSONService.getCombinations();

    lanes.forEach(lane => {
      if (Object.keys(lanesToBeCombined).includes(lane.id)) { // If the lane needs to be combined, combine all this lane and all of its partners into one lane
        var combinations = lanesToBeCombined[lane.id]; // The combinations for this specific lane
        var partners: LaneWithPF[] = [lane]; // Make an array with all the partners, and add the current lane to it
        combinations['partners'].forEach((laneId: string) => {
          var value = lanes.find(lane => lane.id === laneId)?.value ?? 0;
          partners.push(new LaneWithPF(laneId, value));
        });
        if (!lanes.some(lane => lane.id === combinations['newId']))
        lanes.push(new CombinedLane(combinations['newId'], ...partners));
      }
      else lanes.push(lane); // If the lane does not have to be combined, just push it as a normal lane
    });

    return lanes;
  }

  static async reviewLanes(lanes: State<LaneWithPF>): Promise<State<LaneWithPF>> {
    // Sort the state by value from highest to lowest
    lanes = lanes.getSortedState();
    var lanesToTurnGreen = new State<LaneWithPF>();

    for (var i = 0; i < lanes.count || lanesToTurnGreen.count === 4; i++) {
      // Each loop 'reviews' a lane
      var currentLaneForReview = lanes[i];

      // If lanesToTurnGreen is empty it means that we are in the first iteration 
      if (lanesToTurnGreen.isEmpty()) {
        lanesToTurnGreen.addLane(currentLaneForReview); // So we add the most prioritized lane
      }

      // If it's not, it means we need to find the next most prioritized lane.
      else {
        if (lanesToTurnGreen.getAllLanes()
          .every(lane => {
            var phase = JSONService.getPhaseForLane(lane);
            if (phase)
              return Object.values(phase).includes(currentLaneForReview?.id);
            return false;
          }))
          lanesToTurnGreen.addLane(currentLaneForReview); // If yes, this means that there are no crossings and the lane is safe to go green.
      }

      lanes.removeLane(i); // Remove the lane since it's been fully reviewed now.
    }

    return lanesToTurnGreen;
  }
}