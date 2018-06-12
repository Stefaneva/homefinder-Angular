import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, term: any, propName: string, adItemType: any, adItemProp: string): any {
    if ((term === undefined || term === '' || term === 0) && (adItemType === undefined || adItemType === ' ')) {
      return value;
    }
    const filteredItems = [];
    for (const item of value) {
      if (adItemType && term) {
        if (item[propName].toLowerCase().includes(term.toLowerCase()) && item[adItemProp] === adItemType) {
          filteredItems.push(item);
        }
      } else if (term && adItemType === undefined) {
        if (item[propName].toLowerCase().includes(term.toLowerCase())) {
          filteredItems.push(item);
        }
      } else if (adItemType && term === undefined) {
          if (item[adItemProp] === adItemType) {
            filteredItems.push(item);
          }
        }
    }
    return filteredItems;
  }
}
