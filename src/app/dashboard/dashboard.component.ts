import { Component, OnInit } from '@angular/core';
import { RecordSet } from '../RecordSet';
import { ApiService } from '../api.service';
declare var cn:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private rs:RecordSet,private api:ApiService) {

  }
ddata:any;
  ngOnInit(): void {
    this.api.get('comments/get-dashboard-details').subscribe({
      next:(dt:any)=>{
       this.ddata=dt[0];
      }
    });
  }

  isP=false;
  isCP=false;
  isCPO=false;
  isA=false;
  isCA=false;
  isOA=false;
  oadetails:any;
  cadetails:any;
  adetails:any;
pdetails:any;
cpdetails:any;
cpodetails:any;
  getprojectDetails(type:any){
   
      this.api.get('comments/get-project-details?type='+type).subscribe({
        next:(dt:any)=>{
          if(type==1){
            this.isP=true;
           this.pdetails=dt;
          }

          if(type==2){
            this.isCP=true;
           this.cpdetails=dt;
          }

          if(type==3){
            this.isCPO=true;
           this.cpodetails=dt;
          }

          if(type==4){
            this.isA=true;
           this.adetails=dt;
          }

          if(type==5){
            this.isCA=true;
           this.cadetails=dt;
          }

          if(type==6){
            this.isOA=true;
           this.oadetails=dt;
          }
        }
      });
    
  }

  hideprojectDetails(type:any){
    if(type==1){
      this.isP=false;
      this.pdetails=null;
    }

    if(type==2){
      this.isCP=false;
      this.cpdetails=null;
    }

    if(type==3){
      this.isCPO=false;
      this.cpodetails=null;
    }

    if(type==4){
      this.isA=false;
      this.adetails=null;
    }

    if(type==5){
      this.isCA=false;
      this.cadetails=null;
    }

    if(type==6){
      this.isOA=false;
      this.oadetails=null;
    }
  }

}
