import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  constructor(public gs: GlobalService, private fb: FormBuilder) {
    this.productList = this.gs.getProductsFromLOcalStorage()
  }
  productList: any = [];
  query: any;
  filteredList: any;
  formShowHide: boolean = false
  confirmShowHide: boolean = false
  productForm!: FormGroup;
  minPrice: any;
  maxPrice: any
  minPriceArray = [100, 500, 1000]
  maxPriceArray = [2000, 3000, 3500]
  formType: any

  ngOnInit(): void {
    this.initProductForm()
  }

  deleteProduct() {
    this.productData.deleted = true;
    this.filteredList = []
    this.productList = []
    this.filteredList = this.gs.getProductsFromLOcalStorage()
    if (this.filteredList.length) {
      this.filteredList.forEach((ele: any) => {
        console.log(ele);
        if (ele.id === this.productData.id) {
          ele = this.productData;
          this.productList.push(ele)
        } else {
          this.productList.push(ele)
        }
      });
    }
    this.confirmShowHide = false
    localStorage.setItem('product-list', JSON.stringify(this.productList));
    this.gs.showToastMsg('Product deleted successfully','Success')
  }

  likeDislike(data: any, val: string) {
    if (val === 'Added to liked') {
      data.liked = true;
      localStorage.setItem('product-list', JSON.stringify(this.productList));

    } else {
      data.liked = false
      localStorage.setItem('product-list', JSON.stringify(this.productList));
    }

    this.gs.showToastMsg(val,'Success')
  }
  showHideForm(type?: any, contentType?: any, data?: any) {
    this.productData = data
    if (contentType === 'confirm') {
      if (this.confirmShowHide) {
        this.confirmShowHide = false
      } else {
        this.confirmShowHide = true
      }
    } else {
      this.formType = type
      if (this.formShowHide) {
        this.formShowHide = false
      } else {
        this.formShowHide = true
      }
    }

  }

  initProductForm() {
    this.productForm = this.fb.group({
      product_name: ['', [Validators.required,Validators.maxLength(50)]],
      product_desc: ['', [Validators.required,Validators.minLength(150)]],
      product_image: ['', [Validators.required,Validators.pattern(this.gs.urlPattern)]],
      product_price: ['', [Validators.required]],
      instock: [1, [Validators.required]]
    })
  }

  submitForm() {
    
    if (this.productForm.invalid) {
      this.productForm.markAsDirty();
      this.productForm.markAllAsTouched()
      this.gs.showToastMsg("Please fill all the details",'error')
      return
    }
    this.productForm.value['id'] = uuidv4()
    // if (this.productForm.value['instock'] === 'instock') {
    //   this.productForm.value['instock'] = true
    // } else {
    //   this.productForm.value['instock'] = false
    // }
    this.pushFormDataToLS(this.productForm.value)
    this.showHideForm();
    this.gs.showToastMsg('Product added successfully','Success')
    console.log(this.productForm.value);
    this.productForm.reset()
  }

 

  pushFormDataToLS(data?: any) {
    this.productList = this.gs.getProductsFromLOcalStorage()
    if (data) {
      this.productList.push(data);
      localStorage.setItem('product-list', JSON.stringify(this.productList));
    }

  }

  productData: any;
  id: any

  editProduct(data: any, type?: any) {
    this.formType = type
    console.log(data);
    this.productData = data
    this.formShowHide = true;
    this.id = data.id;
    console.log(this.id);
    this.productForm.patchValue(data);

  }

  updateForm() {
    this.filteredList = []
    this.productList = [];
    this.productForm.value['id'] = this.id
    this.filteredList = this.gs.getProductsFromLOcalStorage()
    if (this.filteredList.length) {
      this.filteredList.forEach((ele: any) => {
        if (ele.id === this.id) {
          ele = this.productForm.value;
          this.productList.push(ele)
        } else {
          this.productList.push(ele)
        }
      });
    }
    this.gs.showToastMsg('Product updated successfully','Success')
    localStorage.setItem('product-list', JSON.stringify(this.productList));
    this.showHideForm()
    this.productForm.reset()
  }

  filterProduct(type?: any) {

    if (!this.productList.length) {
      this.productList = this.gs.getProductsFromLOcalStorage()
    }

    if (type === 'price') {
      this.productList = this.productList.filter((res: any) => {
        return res.product_price >= this.minPrice && res.product_price <= this.maxPrice
      })
    }
    if (type === 'instock') {
      this.productList = this.productList.filter((res: any) => {
        return res.instock === true
      })
    }
    if (type === 'oos') {
      this.productList = this.productList.filter((res: any) => {
        return res.instock != true
      })
    }

  }

  clearFilter() {
    this.gs.getProductsFromLOcalStorage()
  }
  get myForm() {
    return this.productForm.controls;
  }

}
