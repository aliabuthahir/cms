import {DateModel} from './date.model';
import {DataModel} from './data.model';

export class MonthsModel implements DataModel {
  name: string;
  children?: DataModel[];

  constructor(month: string) {
    this.name = month;
  }
}
