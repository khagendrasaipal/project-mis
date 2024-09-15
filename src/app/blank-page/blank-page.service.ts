import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class BlankPageService {
  
  url1 = "comments";
  url2="project";
  url3="users";

  create(data: any) {
   
    return this.api.post(this.url2, data);

  }

  update(id: any, data: any) {
    
    return this.api.put(this.url2 + '/' + id, data);
  }

  createItemAssign(data:any){
    return this.api.post('project-activity/assignproject', data);
  }

  getEditAssign(id:any){
    return this.api.get("project-activity/getProjectAssign?aid="+id);
  }

  getPalika(){
    return this.api.get(this.url3+"/getPalika");
  }

  getClient(){
    return this.api.get(this.url2+"/getClient");
  }


  getStages(){
    return this.api.get(this.url2+"/getStages");
  }

  getProject(){
    return this.api.get(this.url1+"/getProject");
  }

  getParentProject(){
    return this.api.get(this.url1+"/getParentProject");
  }

  getProjectchild(id:any){
    return this.api.get(this.url1+"/getProjectchild?id="+id);
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
