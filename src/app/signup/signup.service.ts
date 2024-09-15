import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';


@Injectable({
  providedIn: 'root'
})
export class SignupService {
  url="";
  constructor(private http: HttpClient,private appConfig:AppConfig) {
    this.url = this.appConfig.baseUrl + 'auth/signup';
  }

  create(data: any) {
    return this.http.post(this.url, data);
  }

  checkOtp(data:any){
    return this.http.post(this.url+'/checkotp', data);
  }

  resetPassword(id:any, data:any){
    return this.http.post(this.url + '/reset-password/'+id, data);
  }

  createUser(data: any) {
    // console.log(data);
    return this.http.post(this.url + "/bank-user", data);

  }

  update(id: any, data: any) {
    return this.http.put(this.url + '/' + id, data);
    // return this.api.update(this.path,id,data);
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
    return this.http.get(this.url + urlPart);

}
getEdit(id: string) {
  return this.http.get(this.url + '/' + id);

}
remove(id: string) {
  return this.http.delete(this.url + '/' + id);

}
getUserTypes(){
  return this.http.get(this.url+"/get-usertypes");
}

uploadFile(formData: FormData) {
  let headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  return this.http.post(this.url + "/upload-users", formData, { headers: headers });
}
}
