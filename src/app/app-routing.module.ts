import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from '../app/auth/guards/auth.guard';
import { GuestGuard } from '../app/auth/guards/guest.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [GuestGuard]  // Prevent logged-in users from accessing login
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]  // Requires authentication
  },
  { 
    path: 'projects', 
    component: ProjectListComponent,
    canActivate: [AuthGuard]  // Requires authentication
  },
  { 
    path: 'projects/:id', 
    component: ProjectDetailsComponent,
    canActivate: [AuthGuard]  // Requires authentication
  },
  { 
    path: 'settings', 
    component: SettingsComponent,
    canActivate: [AuthGuard]  // Requires authentication
  },
  // Add a wildcard route for 404 handling
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }