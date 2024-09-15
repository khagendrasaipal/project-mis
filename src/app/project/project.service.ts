import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  url1 = "project";
  url2="users";
  url3="project-activity";

  create(data: any) {
   
    return this.api.post(this.url1, data);

  }

  update(id: any, data: any) {
    
    return this.api.put(this.url1 + '/' + id, data);
  }

  getClient(){
    return this.api.get(this.url1+"/getClient");
  }

  getStaff(){
    return this.api.get(this.url1+"/getStaff");
  }

  getStages(){
    return this.api.get(this.url1+"/getStages");
  }

  getProject(){
    return this.api.get(this.url3+"/getProject");
  }

  getPalika(){
    return this.api.get(this.url2+"/getPalika");
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
