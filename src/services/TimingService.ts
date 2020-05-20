import LightColors from "../enums/LightColors";
import State from "../classes/State";
import TrafficService from "./TrafficService";
import LaneWithPF from "../classes/LaneWithPF";
import CommunicationService from "./CommunicationService";
import LaneWithValue from "../classes/LaneWithValue";

export default class TimingService {
  public static currentLight: LightColors = LightColors.Red;
  private static desiredState: State<LaneWithValue> | undefined;
  private static runTimer: boolean = false;

  // The light timer that runs throughout the app's lifecycle
  public static startTimer() {
    var tick = 0;
    var currentState: State<LaneWithValue>;
    setInterval(() => {
      if (this.runTimer) {
        if(tick === 0) {
          if(this.desiredState) {
            currentState = this.desiredState;
          }
        }

        if (tick < 6) { // 6 seconds for green
          if (this.currentLight != LightColors.Green) {
            this.currentLight = LightColors.Green;
            CommunicationService.sendStateAs(currentState, LightColors.Green);
          }
        }
        else if (tick < 10) { // 10-6 = 4 seconds for orange
          if (this.currentLight != LightColors.Orange) {
            this.currentLight = LightColors.Orange;
            CommunicationService.sendStateAs(currentState, LightColors.Orange);
          }
        }
        else if (tick < 16) { // 16 - 10 = 6 seconds for red
          if (this.currentLight != LightColors.Red) {
            this.currentLight = LightColors.Red;
            CommunicationService.sendStateAs(currentState, LightColors.Red);
          }
        }

        tick++;

        if (tick > 16) { // After 1 cycle (16 seconds) the timer turns off and resets
          tick = 0;
        }
      }
      else {
        tick = 0;
      }
    }, 1000);
  }

  // Gets the data from the websocket and performs the traffic logic on it.
  // This function will run on each update from the websocket.
  public static handle(data: string) {
    var carsState = new State(LaneWithPF, JSON.parse(data));

    this.desiredState = TrafficService.performLogic(carsState);

    if (this.desiredState.isEmptyState()) {
      return;
    }

    this.runTimer = true;
  }
}