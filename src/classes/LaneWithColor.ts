import LightColors from "../enums/LightColors";
import LaneWithValue from "./LaneWithValue";

export default class LaneWithColor extends LaneWithValue {
  readonly isLaneWithColor: boolean = true;

  constructor(public id: string, public value: LightColors.Red | LightColors.Orange | LightColors.Green) {
    super(id, value);
    if (this.value < LightColors.Red || this.value > LightColors.Green) {
      throw "Light can only have the following values: LightColors.Red | LightColors.Orange | LightColors.Green";
    }
  }
}