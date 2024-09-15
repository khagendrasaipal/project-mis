import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class ProjectStatusService {
  
  url1 = "client";
  url2="comments";
  url3="project-activity";

  create(data: any) {
   
    return this.api.post(this.url1, data);

  }

  createOrder(data:any){
    return this.api.post("project-activity/updateorder", data);
  }
  getProject(){
    return this.api.get(this.url3+"/getProject");
  }

  getActivityAll(id:any){
    return this.api.get(this.url2+"/getActivityviewAll?pid="+id);
  }

  getProjectStatus(id:any){
    return this.api.get(this.url2+"/getProjectStatus?pid="+id);
  }

  getStatusDetails(pid:any){
    return this.api.get(this.url2+"/getStatusDetails?pid="+pid);
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
