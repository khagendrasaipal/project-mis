import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorComponent } from './error/error.component';
import { DashboardLayoutComponent } from './layouts/dashboardlayout.component';
import { MinComponent } from './layouts/min.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard, LoginGuard, PermGuard } from './auth/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { ForgetPassComponent } from './login/forget-pass.component';
import { DocumentSettingComponent } from './document-setting/document-setting.component';
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
import { MainActivityComponent } from './mainactivity/mainactivity.component';

// import { SqljsComponent } from './sqljs/database.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate:[AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      // {
      //   path: 'sqljs',
      //   component: SqljsComponent
      // },
      {
        path: 'blank-page',
        component: BlankPageComponent
      },
      // {
      //   path: 'user-manual',
      //   redirectTo: 'https://example.com/redirected-url', // Replace with the actual URL
      // },
      {
        path: 'user-profile',
        component: UserProfileComponent
      },
     
      // {
      //   path: 'document-setting',
      //   component: DocumentSettingComponent
      // },
      {
        canActivate:[PermGuard],
        path: 'staff',
        component: StaffComponent
      },
      {
        canActivate:[PermGuard],
        path: 'client',
        component: ClientComponent
      },
      {
        canActivate:[PermGuard],
        path: 'manage-activity',
        component: ManageactivityComponent
      },

      {
        canActivate:[PermGuard],
        path: 'main-activity',
        component: MainActivityComponent
      },

      {
        canActivate:[PermGuard],
        path: 'project-status',
        component: ProjectStatusComponent
      },
      {
        canActivate:[PermGuard],
        path: 'team',
        component: TeamComponent
      },
      {
        canActivate:[PermGuard],
        path: 'project-cycle',
        component: ProjectCycleComponent
      },
      {
        canActivate:[PermGuard],
        path: 'project-stage',
        component: ProjectStageComponent
      },
      {
        canActivate:[PermGuard],
        path: 'project',
        component: ProjectComponent
      },
      {
        canActivate:[PermGuard],
        path: 'project-activity',
        component: ProjectActivityComponent
      },
      {
        canActivate:[PermGuard],
        path: 'comments',
        component: CommentsComponent
      },
      {
        path: 'project-view',
        component: ProjectViewComponent
      },
      {
        path: 'activity-view',
        component: ActivityViewComponent
      },
      {
        path: 'message-view',
        component: MessageViewComponent
      }

    ]
  },
  {
    path: '',
    component: MinComponent,
    canActivate:[LoginGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'forget-password',
        component: ForgetPassComponent
      },
      {
        path: 'error',
        component: ErrorComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
