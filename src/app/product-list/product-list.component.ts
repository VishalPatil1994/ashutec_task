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
    this.productList = this.gs.getProductsFromLocalStorage()
  }
  productList: any = [];
  query: any;
  filteredList: any;
  formShowHide: boolean = false
  confirmShowHide: boolean = false
  productForm!: FormGroup;
  minPrice: any;
  maxPrice: any
  minPriceArray = [50, 250, 500,1000]
  maxPriceArray = [1500,2000, 3000, 3500]
  formType: any
  productData: any;
  id: any
  ngOnInit(): void {
    this.initProductForm()
  }

  deleteProduct() {
    this.productData.deleted = true;
    this.filteredList = []
    this.productList = []
    this.filteredList = this.gs.getProductsFromLocalStorage()
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
    this.gs.showToastMsg('Product deleted successfully', 'Success')
  }

  likeDislike(data: any, val: string) {
    if (val === 'Added to liked') {
      data.liked = true;
      localStorage.setItem('product-list', JSON.stringify(this.productList));

    } else {
      data.liked = false
      localStorage.setItem('product-list', JSON.stringify(this.productList));
    }

    this.gs.showToastMsg(val, 'Success')
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
      product_name: ['', [Validators.required, Validators.maxLength(50)]],
      product_desc: ['', [Validators.required, Validators.minLength(150)]],
      product_image: ['', [Validators.required, Validators.pattern(this.gs.urlPattern)]],
      product_price: ['', [Validators.required]],
      instock: [1, [Validators.required]]
    })
  }

  submitForm() {

    if (this.productForm.invalid) {
      this.productForm.markAsDirty();
      this.productForm.markAllAsTouched()
      this.gs.showToastMsg("Please fill all the details", 'error')
      return
    }
    this.productForm.value['id'] = uuidv4()
    this.pushFormDataToLS(this.productForm.value)
    this.showHideForm();
    this.gs.showToastMsg('Product added successfully', 'Success')
    console.log(this.productForm.value);
    this.productForm.reset()
  }



  pushFormDataToLS(data?: any) {
    this.productList = this.gs.getProductsFromLocalStorage()
    if (data) {
      this.productList.push(data);
      localStorage.setItem('product-list', JSON.stringify(this.productList));
    }

  }


  editProduct(data: any, type?: any) {
    this.formType = type
    this.productData = data
    this.formShowHide = true;
    this.id = data.id;
    this.productForm.patchValue(data);
  }

  updateForm() {
    this.filteredList = []
    this.productList = [];
    this.productForm.value['id'] = this.id
    this.filteredList = this.gs.getProductsFromLocalStorage()
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
    this.gs.showToastMsg('Product updated successfully', 'Success')
    localStorage.setItem('product-list', JSON.stringify(this.productList));
    this.showHideForm()
    this.productForm.reset()
  }

  getFilter(type: any) {
    let filter: any = {
      price: {
        min: this.minPrice,
        max: this.maxPrice
      }
    }
    if (type != 'price') {
      filter['inStock'] = type === 'inStock' ? true : false
      filter['oos'] = type === 'oos' ? true : false
    }
    return filter
  }
  filterProduct(type?: any) {
    this.productList = this.gs.getProductsFromLocalStorage()
    let filter: any = this.getFilter(type)
    console.log(filter);
    this.productList = this.productList.filter((res: any) => {
      return ((this.minPrice && this.maxPrice) ? (res.product_price >= this.minPrice && res.product_price <= this.maxPrice) : true)
        && (filter.inStock ? res.instock === 1 : (filter.oos ? res.instock === 0 : true))
    })
    return
  }

  clearFilter() {
    this.productList = this.gs.getProductsFromLocalStorage();
    this.minPrice='';
    this.maxPrice=''
  }
  get myForm() {
    return this.productForm.controls;
  }

}
