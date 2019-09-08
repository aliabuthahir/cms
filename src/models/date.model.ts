import {DataModel} from './data.model';

export class DateModel implements DataModel {
  name: string;
  children?: DataModel[];

  constructor(name: string) {
    this.name = name;
  }
}
