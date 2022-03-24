import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(products: any={}){
    return products.filter( (items: { deleted: any; }) => {
      return items.deleted !=true
    })

  }

}
