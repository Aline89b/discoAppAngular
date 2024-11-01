import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { Page404Component } from './components/page404/page404.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResetPWComponent } from './components/reset-pw/reset-pw.component';
import { authGuard } from './auth.guard';
import { CreateLocaleComponent } from './components/create-locale/create-locale.component';

export const routes: Routes = [
  
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: AuthFormComponent  },
  { path: 'login', component: AuthFormComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'resetPW/:id', component: ResetPWComponent },
  { path: 'resetPWrequest', component: ResetPWComponent },
  { path: 'page404', component: Page404Component },
  { path: 'invite-user', component: AuthFormComponent, canActivate: [authGuard],
    data: { roles: ['admin'] }, },
    { path: 'create-locale', component: CreateLocaleComponent, canActivate: [authGuard],
      data: { roles: ['admin'] }, }
];
