import LightColors from "../enums/LightColors";
import State from "../classes/State";
import TrafficService from "./TrafficService";
import LaneWithPF from "../classes/LaneWithPF";
import CommunicationService from "./CommunicationService";

export default class TimingService {
  public static currentLight: LightColors = LightColors.Red;
  public static isHandling: boolean = false;

  private static runTimer: boolean = false;

  // The light timer that runs throughout the app's lifecycle
  public static startTimer() {
    var tick = 0;
    setInterval(() => {
      if (this.runTimer) {
        if (tick < 6) { // 6 seconds for green
          if (this.currentLight != LightColors.Green) {
            this.currentLight = LightColors.Green;
            CommunicationService.sendCurrentStateAs(LightColors.Green);
          }
        }
        else if (tick < 10) { // 10-6 = 4 seconds for orange
          if (this.currentLight != LightColors.Orange) {
            this.currentLight = LightColors.Orange;
            CommunicationService.sendCurrentStateAs(LightColors.Orange);
          }
        }
        else if (tick < 16) { // 16 - 10 = 6 seconds for red
          if (this.currentLight != LightColors.Red) {
            this.currentLight = LightColors.Red;
            CommunicationService.sendCurrentStateAs(LightColors.Red);
          }
        }

        tick++;

        if (tick > 16) { // After 1 cycle (16 seconds) the timer turns off and resets
          tick = 0;
          this.isHandling = false;
          this.runTimer = false;
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
    if(this.isHandling) {
      return;
    }
    this.isHandling = true;

    var carsState = new State(LaneWithPF, JSON.parse(data));

    var desiredState = TrafficService.performLogic(carsState);

    if (desiredState.isEmptyState()) {
      this.isHandling = false;
      return;
    }

    // The desired state gets sent to the communication service, which sends this state as soon as possible (on a timer basis).
    CommunicationService.currentState = desiredState;
    this.runTimer = true;
  }
}