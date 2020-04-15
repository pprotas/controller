import LightColors from "../enums/LightColors";
import State from "../classes/State";
import TrafficService from "./TrafficService";
import LaneWithPF from "../classes/LaneWithPF";
import CommunicationService from "./CommunicationService";

export default class TimingService {
  public static currentLight: LightColors = LightColors.Red;
  public static isHandling: boolean = false;

  private static runTimer: boolean = false;

  public static startTimer() {
    var tick = 0;
    setInterval(() => {
      if (this.runTimer) {
        if (tick < 6) {
          if (this.currentLight != LightColors.Green) {
            this.currentLight = LightColors.Green;
            CommunicationService.sendCurrentStateAs(LightColors.Green);
          }
        }
        else if (tick < 10) {
          if (this.currentLight != LightColors.Orange) {
            this.currentLight = LightColors.Orange;
            CommunicationService.sendCurrentStateAs(LightColors.Orange);
          }
        }
        else if (tick < 12) {
          if (this.currentLight != LightColors.Red) {
            this.currentLight = LightColors.Red;
            CommunicationService.sendCurrentStateAs(LightColors.Red);
          }
        }

        tick++;

        if (tick > 12) {
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

    CommunicationService.currentState = desiredState;
    this.runTimer = true;
  }
}