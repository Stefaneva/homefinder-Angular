import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  check(attributeMin: number, attributeMax: number, attribute: number): boolean {
    if (!attributeMin && !attributeMax) {
      return true;
    } else if (!attributeMax && attribute >= attributeMin) {
        return true;
    } else if (!attributeMin && attribute <= attributeMax) {
      return true;
    } else if (attribute >= attributeMin && attribute <= attributeMax) {
      return true;
    }
    return false;
  }

  checkSingleProp(propertyValue: any, item: any) {
    if (!propertyValue) {
      return true;
    } else if (propertyValue === item) {
      return true;
    }
    return false;
  }

  checkPropertyBoolean(propertyOne: boolean, propertyTwo: boolean, item: any, propertyValueOne: string, propertyValueTwo: string) {
    if ((!propertyOne && !propertyTwo) || (propertyOne && propertyTwo)) {
      return true;
    } else if (!propertyOne && propertyTwo && item === propertyValueTwo) {
       return true;
    } else if (!propertyTwo && propertyOne && item === propertyValueOne) {
      return true;
    }
    return false;
  }

  transform(value: any, term: any, propName: string, adItemType: any, adItemTypeProp: string, priceMin: number,
            priceMax: number, priceProp: string, rent: boolean, sale: boolean, adTypeProp: string,
            surfaceMin: number, surfaceMax: number, surfaceProp: string, areaSurfaceMin: number, areaSurfaceMax: number,
            areaSurfaceProp: string, roomsMin: number, roomsMax: number, roomsProp: string,
            partitioning: string, partitioningProp: string, yearBuiltMin: number, yearBuiltMax: number, yearBuiltProp: string,
            comfort: number, comfortProp: string, floorLevelMin: number, floorLevelMax: number, floorLevelProp: string,
            furnished: string, furnishedProp: string): any {

    if ((term === undefined || term === '' || term === 0) && (adItemType === undefined || adItemType === ' ' || adItemType === 'Toate') &&
        !priceMin && !priceMax && !rent && !sale && !surfaceMin && !surfaceMax && !areaSurfaceMin && !areaSurfaceMax &&
        !roomsMin && !roomsMax && !partitioning && !yearBuiltMin && !yearBuiltMax && !comfort && !floorLevelMin &&
        !floorLevelMax && !furnished) {
      return value;
    }
    const filteredItems = [];
    for (const item of value) {
      if (adItemType === 'Toate' || !adItemType) {
        if (this.check(priceMin, priceMax, item[priceProp]) && this.check(surfaceMin, surfaceMax, item[surfaceProp]) &&
          this.check(roomsMin, roomsMax, item[roomsProp]) && this.check(yearBuiltMin, yearBuiltMax, item[yearBuiltProp]) &&
          this.checkSingleProp(furnished, item[furnishedProp]) &&
          this.checkPropertyBoolean(rent, sale, item[adTypeProp], 'Inchiriere', 'Vanzare')) {
            if (term && item[propName].toLowerCase().includes(term.toLowerCase())) {
              filteredItems.push(item);
            } else if (!term) {
              filteredItems.push(item);
            }
        }
      } else if (adItemType === 'Casa') {
        if (this.check(priceMin, priceMax, item[priceProp]) && this.check(surfaceMin, surfaceMax, item[surfaceProp]) &&
          this.check(roomsMin, roomsMax, item[roomsProp]) && this.check(yearBuiltMin, yearBuiltMax, item[yearBuiltProp]) &&
          this.checkSingleProp(furnished, item[furnishedProp]) && this.checkSingleProp(adItemType, item[adItemTypeProp]) &&
          this.checkPropertyBoolean(rent, sale, item[adTypeProp], 'Inchiriere', 'Vanzare') &&
          this.check(areaSurfaceMin, areaSurfaceMax, item[areaSurfaceProp])) {
          if (term && item[propName].toLowerCase().includes(term.toLowerCase())) {
            filteredItems.push(item);
          } else if (!term) {
            filteredItems.push(item);
          }
        }
      } else if (adItemType === 'Apartament') {
        if (this.check(priceMin, priceMax, item[priceProp]) && this.check(surfaceMin, surfaceMax, item[surfaceProp]) &&
          this.check(roomsMin, roomsMax, item[roomsProp]) && this.check(yearBuiltMin, yearBuiltMax, item[yearBuiltProp]) &&
          this.checkSingleProp(furnished, item[furnishedProp]) && this.checkSingleProp(adItemType, item[adItemTypeProp]) &&
          this.checkPropertyBoolean(rent, sale, item[adTypeProp], 'Inchiriere', 'Vanzare') &&
          this.checkSingleProp(comfort, item[comfortProp]) && this.check(floorLevelMin, floorLevelMax, item[floorLevelProp]) &&
          this.checkSingleProp(partitioning, item[partitioningProp])) {
          if (term && item[propName].toLowerCase().includes(term.toLowerCase())) {
            filteredItems.push(item);
          } else if (!term) {
            filteredItems.push(item);
          }
        }
      }
    }
    return filteredItems;
  }
}
