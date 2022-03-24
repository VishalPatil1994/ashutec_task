import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  routerState
  constructor(public gs: GlobalService,public router: Router) {
    this.routerState = this.router.getCurrentNavigation()!.extras.state;
   }

  ngOnInit(): void {
  }

}
