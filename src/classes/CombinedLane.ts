import ILaneWithValue from "../interfaces/ILaneWithValue";
import LaneWithValue from "./LaneWithValue";

export default class CombinedLane<Lane extends LaneWithValue> implements ILaneWithValue {
  public partners: Lane[];

  private _value:number = 0;
  get value(): number {
    return this._value;
  }
  
  set value(value: number) {
    this._value = value;
  }

  constructor(public id: string, ...lanes: Lane[]) {
    this.partners = lanes;
    this.partners.forEach(lane => {
      this._value += lane.value;
    });
  }
}