import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uniquePipe'
})
export class UniquePipePipe implements PipeTransform {

  transform(value: any[], field: string): any[] {
    const uniqueValues = new Set();

    if (value) {
      return value.filter(item => {
        const fieldValue = item[field];
        if (!uniqueValues.has(fieldValue)) {
          uniqueValues.add(fieldValue);
          return true;
        }
        return false;
      });
    }

    return value;
  }

}
