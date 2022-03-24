import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {

  constructor(public gs: GlobalService) { }
  productList: any
  ngOnInit(): void {
    this.productList = this.gs.getProductsFromLOcalStorage()
  }

  restoreProduct(val: any) {
    val.deleted = false;
    this.gs.showToastMsg('Product restored successfully','Success')
    localStorage.setItem('product-list', JSON.stringify(this.productList));
    this.productList=this.gs.getProductsFromLOcalStorage()
  }
  

}
