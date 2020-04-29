import ILaneWithValue from "../interfaces/ILaneWithValue";
import LaneWithValue from "./LaneWithValue";

// A class representing the combination of two lanes into one lane (example: A2 and A3 => A23)
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
    // Accepts multiple lanes as parameter
    this.partners = lanes;
    
    // The values of all lanes gets combined into a single value
    this.partners.forEach(lane => {
      this._value += lane.value;
    });
  }
}