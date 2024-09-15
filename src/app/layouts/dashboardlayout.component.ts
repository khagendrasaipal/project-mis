import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `<app-header></app-header>
            <app-sidebar></app-sidebar>
            <main id="main" class="main">
              <router-outlet></router-outlet>
            </main>
            
            <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-circle"></i></a>`,
})
export class DashboardLayoutComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
