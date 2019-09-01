import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'textLastpart'
})
export class TextLastpartPipe implements PipeTransform {

  transform(text: string = '', separator: string = ''): string {
    if (!separator) {
      separator = '.';
    }
    let lastPart = text.substr(text.indexOf(separator) + 1, text.length);
    if (!lastPart) {
      lastPart = 'Not Available';
    }
    return lastPart;
  }

}
