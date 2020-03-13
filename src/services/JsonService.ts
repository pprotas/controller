import * as jsonfile from 'jsonfile';
import ILaneWithValue from '../interfaces/ILaneWithValue';
import LightColors from '../enums/LightColors';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import LaneWithValue from '../classes/LaneWithValue';

export default class JSONService {
  private static  phasesFile = `${process.cwd()}/public/json/phases.json`;
  private static initFile = `${process.cwd()}/public/json/init.json`;

  static getPhases() {
    return jsonfile.readFileSync(this.phasesFile);
  }

  static getPhaseForLane(lane: ILaneWithValue): [string, number[]] | undefined {
    var phases = this.getPhases();
    for (var property in phases) {
      if (property === lane.id) {
        return phases[property];
      }
    }
    return undefined;
  }

  static async getInit(): Promise<State<LaneWithValue>> {
    var jsonObject = await jsonfile.readFile(this.initFile);
    return new State<LaneWithValue>(LaneWithValue, jsonObject);
  }


  // Haalt alle mogelijke groene lichten op, dit betekent niet dat deze lichten ook daadwerkelijk groen moeten worden.
  static async applyPhase(lane: ILaneWithValue): Promise<State<LaneWithColor>> {
    var phase = this.getPhaseForLane(lane);
    var init = await this.getInit();

    Object.values(init).forEach(lane => {
      if (phase)
        if (phase.includes(lane.id))
          lane.value = LightColors.Green;
    });

    return <State<LaneWithColor>>init;
  }
}