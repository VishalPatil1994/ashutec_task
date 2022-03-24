import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(public router: Router,private toastr: ToastrService) { }
  urlPattern = /^(?:(http(s)?)?(sftp)?(ftp)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  navigateById(path: string, id?: string,data?:any) {
    this.router.navigate([path + '/' + id],{
      state: data
    })
  }
  showToastMsg(val:string,type:string) {
    if(type==='Success'){
      this.toastr.success(val, type);
    }else{
      this.toastr.error(val,type)
    }
  }
  getProductsFromLOcalStorage() {
    return JSON.parse(localStorage.getItem("product-list") || '[]')
  }
}
