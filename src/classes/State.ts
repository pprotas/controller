
export default class State<Lane> {

  [index: number]: Lane

  count: number = 0;

  next:number = 1;

  constructor(type?: { new(id: string, value: number): Lane; }, object?: object) {
    if (object && type) {
      Object.entries(object)
        .sort((a, b) => b[1] - a[1])
        .forEach((parameter: any, index: number) => {
          this[index] = new type(parameter[0], parameter[1]);
          this.count++;
        });
    }
  }

  toJson(): string {
    let json: string = "{\n";

    var x = Object.values(this);
    x.forEach(lane => {
      if(lane.id)
      json += `"${lane.id}": ${lane.value},`;
    });

    json = json.substring(0, json.length - 1);
    json += "\n}";

    return JSON.parse(json);
  }
}