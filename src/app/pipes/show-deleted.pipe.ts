import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showDeleted'
})
export class ShowDeletedPipe implements PipeTransform {

  transform(products: any={}){
    return products.filter( (items: { deleted: any; }) => {
      return items.deleted ==true
    })

  }
}
