import {DataModel} from './data.model';

export class YearModel implements DataModel {
  name: string;
  children?: DataModel[];

  constructor(name: string) {
    this.name = name;
  }
}
