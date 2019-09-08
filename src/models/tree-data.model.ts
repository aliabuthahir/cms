import {DataModel} from './data.model';

export class TreeDataModel implements DataModel {
  name: string;
  children?: DataModel[];

  constructor(name: string) {
    this.name = name;
  }
}
