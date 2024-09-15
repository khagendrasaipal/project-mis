import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AppConfig } from 'src/app/app.config';
import { RecordSet } from 'src/app/RecordSet';
import { UserProfileService } from 'src/app/user-profile/user-profile.service';
declare var cn:any;
@Component({
  selector: 'app-sidebar',
  template: `<aside id="sidebar" class="sidebar">
  <ul class="sidebar-nav" id="sidebar-nav">
 
    <app-sidebaritem [menuItems]="menuItems"></app-sidebaritem>
    
  </ul>
  <!-- <footer class="footer">
  <div class="copyright" style="text-align: center;  color: #012970;">
    &copy;  <strong><span> FCGO (2080)</span></strong>
  </div>
  <div class="credits" style="padding-top: 5px;  text-align: center;  font-size: 13px;  color: #012970;">
   
    Support: 
  </div>

  <div class="credits" style="padding-top: 5px;  text-align: center;  font-size: 13px;  color: #012970;">
   
   <i class="bi bi-telephone"></i>  01-4770387 <br> <i class="bi bi-envelope"></i>  sutra.support@fcgo.gov.np
  </div>
  </footer> -->

<!-- <a style="margin-top:50px" target="_blank" class="btn btn-success" href="{{baseurl}}images/Local Level Revenue Portal_user_manual.pdf">User Manual</a> -->
</aside>
`,
})
export class SidebarComponent implements OnInit {
  menuItems: any = [];
  name:any;
  users:any;
  userinfo:any;
  baseurl:any;
  perm:any;
  constructor(public appConfig:AppConfig,private ps:UserProfileService,private rs:RecordSet,private api:ApiService) {
    this.baseurl=appConfig.baseUrl;
   }
  ngOnInit(): void {
    // this.api.get('get-export-query').subscribe({
    //   next:(dt:any)=>{
    //     if(dt.data){
    //         const dec =  decodeURIComponent(atob(dt.data.data));
    //         cn.execute(dec);
    //         //cn.save();

    //     }
    //   }
    // });
      this.ps.getUserinfo().subscribe({next:(dt)=>{
        this.users = dt;
        // console.log(dt);
        this.userinfo=this.users[0];
       this.perm=this.userinfo.permid;


        
       this.menuItems = [
        {
          title: "Dashboard",
          link: '/dashboard',
          icon: "bi bi-speedometer",
        },
        {
          title: "Manage Project ",
          link: '/blank-page',
          icon: "bi bi-browser-safari",
        },
       
      
    
      ];


    if(this.perm==8){
      this.menuItems = [
        {
          title: "Dashboard",
          link: '/dashboard',
          icon: "bi bi-speedometer",
        },
        {
          title: "Team ",
          link: '/team',
          icon: "bi bi-people",
        },
        {
          title: "Member ",
          link: '/staff',
          icon: "bi bi-person",
        },
        // {
        //   title: "Client",
        //   link: 'client',
        //   icon: "bi bi-link-45deg",
        // },
        {
          title: "Project Cycle",
          link: 'project-cycle',
          icon: "bi bi-recycle",
        },
        {
          title: "Project Stage",
          link: 'project-stage',
          icon: "bi bi-stack",
        },
        {
          title: "Project ",
          link: 'project',
          icon: "bi bi-database",
        },
        {
          title: "Project Activity",
          link: 'project-activity',
          icon: "bi bi-boxes",
        },
        {
          title: "Comments",
          link: 'comments',
          icon: "bi bi-messenger",
        },
        {
          title: "Manage Activity ",
          link: '/manage-activity',
          icon: "bi bi-browser-safari",
        },
        {
          title: "Manage Project ",
          link: '/blank-page',
          icon: "bi bi-browser-safari",
        },

        {
          title: "Project Status ",
          link: '/project-status',
          icon: "bi bi-clipboard2-data",
        },
       
        
        // {
        //   title: "भुक्तानी स्थिति",
        //   link: '',
        //   icon: "bi bi-credit-card",
        //   childs:[
        //     {
        //       title: "भुक्तानी नगरिएको भौचर  ",
        //       link: '/payment-status-unpaid',
        //       icon: "bi bi-circle",
        //     },
        //     {
        //       title: "भुक्तानी गरिएको भौचर ",
        //       link: '/payment-status',
        //       icon: "bi bi-circle",
        //     },
        //   ]
        // },
      
        
      
    
      ];
    }
      },error:err=>{

      }});
   
  }
}
