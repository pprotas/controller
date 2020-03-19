import LightColors from "../enums/LightColors";
import CommunicationService from "./CommunicationService";

export default class TimingService {
    public static currentLight: LightColors = LightColors.Red;
    public static carsAtIntersection: boolean = false;

    public static startTimer() {
        var tick = 0;
        setInterval(() => {
            if (tick < 2) {
                if (this.currentLight !== LightColors.Red) {
                    this.currentLight = LightColors.Red;
                    CommunicationService.sendCurrentStateAs(LightColors.Red);
                }
            }
            else if (tick < 8) {
                if (this.currentLight !== LightColors.Green) {
                    this.currentLight = LightColors.Green;
                    CommunicationService.sendLastStateAs(LightColors.Green);
                }
            }
            else if (tick < 12) {
                if (this.currentLight !== LightColors.Orange) {
                    this.currentLight = LightColors.Orange;
                    CommunicationService.sendCurrentStateAs(LightColors.Orange);
                }
                if (tick === 11)
                    CommunicationService.currentState = CommunicationService.lastState;
            }
            if (tick >= 12) {
                tick = 0;
            }
            if (this.carsAtIntersection) tick++;
            else tick = 0; // If there are no cars light can stay red
        }, 1000);
    }
}