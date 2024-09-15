import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  name="";
  baseurl:any;
  constructor(@Inject(DOCUMENT) private document: Document,private auth:AuthService,private router:Router,public appConfig:AppConfig) {
    this.baseurl=appConfig.baseUrl;
   }

  ngOnInit(): void {
    const details = this.auth.getUserDetails();
    if (details) {
      this.name = details.name;
    }
  }
  toggleSidebar() {
    const kl = "toggle-sidebar";
    if (this.document.body.classList.contains(kl)) {
      this.document.body.classList.remove(kl);
    } else {
      this.document.body.classList.add(kl);
    }
  }
  logout() {
    if (confirm("Are you sure you want to logout?")) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }
}
