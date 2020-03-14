import LaneWithPF from "./LaneWithPF";

export default class CombinedLanesWithPF extends LaneWithPF {
  readonly isLaneWithPF: boolean = true;

  public componentLanesWithPF: LaneWithPF[];

  private _value:number = 0;

  get value(): number {
    return this._value;
  }
  
  set value(value: number) {
    this._value = value;
  }

  constructor(public id: string, ...laneWithPF: LaneWithPF[]) {
    super(id, 0);
    this.componentLanesWithPF = laneWithPF;
    this.componentLanesWithPF.forEach(lane => {
      this._value += lane.value;
    });
  }
}