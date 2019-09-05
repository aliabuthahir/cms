import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fileTrimmer'
})
export class FileTrimmerPipe implements PipeTransform {

  transform(text: string = '', length: number = 8): string {
    let result = '';
    text.length > 5 ? result = `${text.substr(0, length)}...` : result = text;
    return result;
  }
}
