import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, term: any, propName: string, adItemType: any, adItemProp: string): any {
    console.log(adItemProp + ' ' + adItemType);
    if (term === undefined || term === '' || term === 0) {
      return value;
    }
    const filteredItems = [];
    for (const item of value) {
      if (item[propName].toLowerCase().includes(term.toLowerCase()) && item[adItemProp] === adItemType) {
        filteredItems.push(item);
      }
    }
    return filteredItems;
  }
}
