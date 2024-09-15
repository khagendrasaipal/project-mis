import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppComponent } from './app.component';
import { MinComponent } from './layouts/min.component';
import { DashboardLayoutComponent } from './layouts/dashboardlayout.component';
import { HeaderComponent } from './layouts/parts/header.component';
import { SidebarComponent } from './layouts/parts/sidebar.component';
import { SidebaritemComponent, SidebaritemInnerComponent } from './layouts/parts/sidebaritem.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent, TwoFaModalComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './app-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AppConfig } from './app.config';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpInterceptorService } from './http-interceptor.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AuthGuard, LoginGuard, PermGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiService } from './api.service';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from './validation.service';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ForgetPassComponent } from './login/forget-pass.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { RecordSet } from './RecordSet';

import { TaxCalculate } from './tax-calculation';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DocumentSettingComponent } from './document-setting/document-setting.component';
import { UniquePipePipe } from './unique-pipe.pipe';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { StaffComponent } from './staff/staff.component';
import { ClientComponent } from './client/client.component';
import { ProjectCycleComponent } from './project-cycle/project-cycle.component';
import { ProjectStageComponent } from './project-stage/project-stage.component';
import { ProjectComponent } from './project/project.component';
import { ProjectActivityComponent } from './project-activity/project-activity.component';
import { CommentsComponent } from './comments/comments.component';
import { ProjectViewComponent } from './projectview/projectview.component';
import { ActivityViewComponent } from './activityview/activityview.component';
import { MessageViewComponent } from './messageview/messageview.component';
import { TeamComponent } from './team/team.component';
import { ManageactivityComponent } from './manageactivity/manageactivity.component';
import { ProjectStatusComponent } from './projectstatus/projectstatus.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MainActivityComponent } from './mainactivity/mainactivity.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    MinComponent,
    DashboardLayoutComponent,
    SidebaritemComponent,
	  SidebaritemInnerComponent,
    BlankPageComponent,
    DashboardComponent,
    LoginComponent,
    ErrorComponent,
    UserProfileComponent,
    SignupComponent,
    ForgetPassComponent,
    TwoFaModalComponent,
    ClientComponent,
    DocumentSettingComponent,
    StaffComponent,
    UniquePipePipe,
    ProjectCycleComponent,
    ProjectStageComponent,
    ProjectComponent,
    ProjectActivityComponent,
    CommentsComponent,
    ProjectViewComponent,
    ActivityViewComponent,
    MessageViewComponent,
    TeamComponent,
    ManageactivityComponent,
    ProjectStatusComponent,
    MainActivityComponent


  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    NgSelectModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxSliderModule,
  ],
  providers: [
    AppConfig,
    provideNgxMask(),
    { provide: APP_INITIALIZER, useFactory: (config: AppConfig) => () => config.loadConfig(), deps: [AppConfig], multi: true },
	  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpInterceptorService,
        multi: true,
    },
    AuthGuard,
    PermGuard,
    AuthService,
    LoginGuard,
    ApiService,
    ValidationService,
    RecordSet,
    TaxCalculate
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
