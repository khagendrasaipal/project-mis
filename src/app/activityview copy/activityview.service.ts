import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class ActivityViewService {
  
  url1 = "comments";
  url2="project"
  url3="project-activity"
  // baseUrl: string = AppConfig.baseUrl;
  create(data: any) {
   
    return this.api.post(this.url3, data);

  }

  update(id: any, data: any) {
    
    return this.api.put(this.url1 + '/' + id, data);
  }

  sendReply(data:any){
    return this.api.post(this.url1+'/sendReply', data);
  }

  getTeam(){
    return this.api.get("users/getteam");
  }
  getMsg(aid:any,pid:any){
    return this.api.get(this.url1+"/getMessagebyid?projectid="+pid+"&actid="+aid);
  }
  getProject(){
    return this.api.get(this.url1+"/getProject");
  }

  getProjectDetails(id:any){
    return this.api.get(this.url1+"/getProjectDetails?id="+id);
  }

  getMessage(id:any){
    return this.api.get(this.url1+"/getMessage?id="+id);
  }

  getParents(pid:any){
    return this.api.get(this.url1+"/getActivityviewAlls?pid="+pid);
  }

  uploadFile(form:FormData){
    return this.http.post(this.appConfig.baseUrl+"file-repo/storefiles",form);
  }

  completeStatus(status:any,id:any,pid:any,main:any){
    return this.api.get(this.url1+"/completeStatus?status="+status+"&id="+id+"&projectid="+pid+"&main="+main);
  }

  getActivity(id:any){
    return this.api.get(this.url1+"/getActivityview?pid="+id);
  }

  getStaff(id:any){
    return this.api.get("project-activity/getStaffbyProject?pid="+id);
  }

  getStages(){
    return this.api.get(this.url2+"/getStages");
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
