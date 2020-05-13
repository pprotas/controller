import JSONService from './JsonService';
import LaneWithPF from '../classes/LaneWithPF';
import State from '../classes/State';
import CombinedLane from '../classes/CombinedLane';
import LaneWithValue from '../classes/LaneWithValue';

// Main traffic light logic
export default class TrafficService {
  public static masterPrioState: State<LaneWithPF> = new State();

  static performLogic(currentStateWithPF: State<LaneWithPF>): State<LaneWithValue> {
    // Combine lanes that can be counted as one lane (example: A2 and A3)
    var combinedCurrentLanesWithPF: LaneWithPF[] = TrafficService.combineLanes(this.masterPrioState.getAllLanes());

    //Add only lanes with a positive value to be reviewed, lanes with no cars don't need to turn green.
    var lanesToBeReviewed = new State<LaneWithPF>();

    combinedCurrentLanesWithPF.forEach(lane => {
      if (lane.value > 0) lanesToBeReviewed.addLane(lane);
    });

    // The lanes with the highest values and no crossings can turn green
    var lanesToTurnGreen = TrafficService.reviewLanes(lanesToBeReviewed);

    // Split the combined lanes so the state is ready to be sent to controller
    lanesToTurnGreen = lanesToTurnGreen.getSplitUpState();

    // The state doesn't contain all lanes yet, so we add them here
    lanesToTurnGreen.fillEmptyLanes();

    // Remember which lanes didn't turn green for next turn, and give those a higher priority
    // Small algorithm that gives lanes a bonus based on how long the cars are waiting
    lanesToTurnGreen.getAllLanes().forEach(lane => {
      if(lane.id === "AB1" || lane.id === "AB2" || lane.id === "BB1") {
        lane.value * 10;
      }
      
      if (lane.value <= 1) {
        var x = this.masterPrioState.getLaneById(lane.id);
        var y = currentStateWithPF.getLaneById(lane.id);

        if (x && y) {
          x.value += y.value * 2;
        }
      }
      else {
        var x = this.masterPrioState.getLaneById(lane.id);
        if(x) {
          x.value = 1;
        }
      }
    })

    return lanesToTurnGreen;
  }

  static combineLanes(lanes: LaneWithPF[]) {
    var lanesToBeCombined = JSONService.getCombinations();
    var combinedLanes: LaneWithPF[] = [];

    lanes.forEach(lane => {
      if (Object.keys(lanesToBeCombined).includes(lane.id)) { // If the lane needs to be combined, combine all this lane and all of its partners into one lane
        var combinations = lanesToBeCombined[lane.id]; // The combinations for this specific lane
        var partners: LaneWithPF[] = [lane]; // Make an array with all the partners, and add the current lane to it
        combinations['partners'].forEach((laneId: string) => {
          var partnersIds = partners.map(lane => lane.id);
          if (!partnersIds.includes(laneId)) {
            var value = lanes.find(lane => lane.id === laneId)?.value ?? 0;
            partners.push(new LaneWithPF(laneId, value));
          }
        });
        if (!combinedLanes.some(lane => lane.id === combinations['newId']))
          combinedLanes.push(new CombinedLane(combinations['newId'], ...partners));
      }
      else combinedLanes.push(lane); // If the lane does not have to be combined, just push it as a normal lane
    });

    return combinedLanes;
  }

  static reviewLanes(lanes: State<LaneWithPF>): State<LaneWithPF> {
    // Sort the state by value from highest to lowest
    lanes = lanes.getStateSortedByValue();
    var lanesToTurnGreen = new State<LaneWithPF>();

    for (var i = 0; i < lanes.count; i++) {
      // Each loop 'reviews' a lane
      var currentLaneForReview = lanes[i];

      // If lanesToTurnGreen is empty it means that we are in the first iteration 
      if (lanesToTurnGreen.isEmptyState()) {
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

      lanes.removeLane(i); // Remove the lane from the review list since it's been fully reviewed now.
    }

    return lanesToTurnGreen;
  }
}