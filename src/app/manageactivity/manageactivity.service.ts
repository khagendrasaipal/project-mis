import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class ManageactivityService {
  
  url1 = "client";
  url2="comments";
  url3="project-activity";
  url4="project";

  create(data: any) {
   
    return this.api.post(this.url1, data);

  }

  createItemAssign(data:any){
    return this.api.post("project-activity/updateAssign", data);
  }

  createOrder(data:any){
    return this.api.post("project-activity/updateorder", data);
  }
  getProject(){
    return this.api.get(this.url3+"/getProject");
  }

  getEditAssign(id:any,pid:any){
    return this.api.get(this.url3+"/getEditAssign?aid="+id+"&pid="+pid);
  }

  getStaff(){
    return this.api.get(this.url4+"/getStaff");
  }

  getStaffbyProject(id:any){
    return this.api.get("project-activity/getStaffbyProject?pid="+id);
  }

  getActivityAll(id:any){
    return this.api.get(this.url2+"/getActivityviewAll?pid="+id);
  }

  update(id: any, data: any) {
    
    return this.api.put(this.url1 + '/' + id, data);
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
