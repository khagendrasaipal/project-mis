import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentSettingService {
  
  url = "taxpayer";
  url1 = "document-setting";
  urls="";

  create(data: any) {
   
    return this.api.post(this.url1, data);

  }

  update(id: any, data: any) {
    
    return this.api.put(this.url1 + '/' + id, data);
  }

  getTaxpayer(){
    return this.api.get(this.url1+'/getTaxpayer');
  }

  getUserprofile() {
    return this.api.get(this.url1+'/getUserprofile');
  }

  getRevenue(type:any){
    return this.api.get(this.url1+'/getRevenue?type='+type);
  }
  getPayerinfo(id:any){
    return this.api.get(this.url1+'/getPayerinfo?id='+id);
  }

  getDistrict(){
    return this.api.get(this.url+'/getDistrict');
  }

  getEnroll(){
    return this.api.get(this.url+'/getEnroll');
  }
 
  getPalikaAll(id:any){
    return this.api.get(this.url+'/getPalika?did='+id);
  }
  getdoctype(code:any){
    return this.api.get(this.url+'/getDoctype?code='+code);
  }

  constructor(private api: ApiService,private http: HttpClient,private appConfig:AppConfig) {
    this.urls = this.appConfig.baseUrl + 'taxpayer';
  }

  getList(perPage: string | number, page: string | number, searchTerm?: string, sortKey?: string, sortDir?: boolean) {

    let urlPart = '?perPage=' + perPage + '&page=' + page;
    if (typeof searchTerm !== 'undefined' || searchTerm !== '') {
      urlPart += '&searchOption=all&searchTerm=' + searchTerm;
    }
    if (typeof sortKey !== 'undefined' || sortKey !== '') {
      urlPart += '&sortKey=' + sortKey;
    }
    if (typeof sortDir !== 'undefined' && sortKey !== '') {
      if (sortDir) {
        urlPart += '&sortDir=desc';
      } else {
        urlPart += '&sortDir=asc';
      }
    }
    return this.api.get(this.url1 + urlPart);

  }
  getEdit(id: string) {
    return this.api.get(this.url1 + '/' + id);

  }
  remove(id: string) {
    return this.api.delete(this.url1 + '/' + id);

  }
  getlist() {
    return this.api.get(this.url + '/get-list');
  }
}
