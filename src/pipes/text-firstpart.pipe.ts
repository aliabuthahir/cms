import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'textFirstpart'
})
export class TextFirstpartPipe implements PipeTransform {

  transform(text: string = '', separator: string = ''): string {
    if (!separator) {
      separator = '.';
    }
    return text.substr(0, text.indexOf(separator));
  }
}
