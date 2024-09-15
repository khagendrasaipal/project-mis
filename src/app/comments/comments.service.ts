import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  
  url1 = "comments";

  create(data: any) {
   
    return this.api.post(this.url1, data);

  }

  update(id: any, data: any) {
    
    return this.api.put(this.url1 + '/' + id, data);
  }

  getProject(){
    return this.api.get(this.url1+"/getProject");
  }

  getParents(){
    return this.api.get(this.url1+"/getParents");
  }

  getActivity(id:any){
    return this.api.get(this.url1+"/getActivity?pid="+id);
  }

  getStaff(){
    return this.api.get(this.url1+"/getStaff");
  }

  getComments(){
    return this.api.get(this.url1+"/getComments");
  }

  constructor(private api: ApiService,private http: HttpClient,private appConfig:AppConfig) {
    // this.urls = this.appConfig.baseUrl + 'taxpayer';
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
 
}
