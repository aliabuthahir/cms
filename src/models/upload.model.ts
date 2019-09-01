import {Subject} from "rxjs";

export class UploadModel {
  $key: string;
  file: File;
  url: string;
  progress: Subject<any>;
  createdOn: Date = new Date();
  name: string;

  constructor(file: File) {
    this.file = file;
  }
}
