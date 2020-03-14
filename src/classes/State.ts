import LaneWithValue from "./LaneWithValue";
import CombinedLanesWithPF from "./CombinedLanesWithPF";
import LaneWithColor from "./LaneWithColor";
import LightColors from "../enums/LightColors";

export default class State<Lane> {

  [index: number]: Lane

  private _count: number = 0;
  get count(): number {
    return this._count;
  }

  constructor(type?: { new(id: string, value: number): Lane; }, object?: object) {
    if (object && type) {
      Object.entries(object)
        .sort((a, b) => b[1] - a[1])
        .forEach((parameter: any) => {
          this.addLane(new type(parameter[0], parameter[1]));
        });
    }
  }

  getSortedState(): State<Lane> {
    var sortedLanes = <[Lane]>Object.values(this)
      .sort((a, b) => b.value - a.value);
    var sortedState= new State<Lane>();
    sortedLanes.forEach(lane => sortedState.addLane(lane));
    return sortedState;
  }

  getSplitUpState(): State<LaneWithColor> {
    var partners: LaneWithColor[] = [];
    this.getAllLaneValues().forEach(lane => {
      if(lane instanceof CombinedLanesWithPF){
        lane.componentLanesWithPF.forEach(lane => partners.push(new LaneWithColor(lane.id, LightColors.Green)));
      }
      else partners.push(new LaneWithColor(lane.id, LightColors.Green));
    });
    var state = new State<LaneWithColor>();
    partners.forEach(lane => state.addLane(lane));
    return state;
  }

  addLane(lane: Lane, index?: number): void {
    if (!index)
      index = this.count;
    this[index] = lane;
    this._count++;
  }

  removeLane(index: number): void {
    delete this[index];
    this._count--;
  }

  getAllLaneIds(): string[] {
    return this.getAllLaneValues().map(lane => lane.id);
  }

  getAllLaneValues(): LaneWithValue[] {
    var lanes = Object.values(this);
    lanes.forEach((lane, index) => {
      if (lane.id == undefined) {
        delete lanes[index];
      }
    })

    return lanes;
  }

  getAllCombinations(): CombinedLanesWithPF[] {
    var x = this.getAllLaneValues();
    var y = x.filter(lane => lane instanceof CombinedLanesWithPF);;
    return <CombinedLanesWithPF[]>y;
  }

  getAllLaneEntries(): [string, Lane][] {
    return Object.entries(this);
  }

  pop(): Lane {
    return this[this.count - 1];
  }

  isEmpty(): boolean {
    if (this.count) {
      return false;
    }
    return true;
  }

  toJson(): string {
    let json: string = "{\n";

    var x = Object.values(this);
    x.forEach(lane => {
      if (lane.id)
        json += `"${lane.id}": ${lane.value},`;
    });

    json = json.substring(0, json.length - 1);
    json += "\n}";

    return JSON.parse(json);
  }
}