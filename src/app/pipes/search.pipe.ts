import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(products: any={},searchText: string=''){
    if(!products){
      return {}
    }

    if(searchText == ''){
      return products;
    }

    return products.filter( (items: { product_name: string; }) => {
      return items.product_name.toLowerCase().includes(searchText)
    })

  }

}
