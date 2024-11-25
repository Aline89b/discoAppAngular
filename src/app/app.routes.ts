import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { Page404Component } from './components/page404/page404.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResetPWComponent } from './components/reset-pw/reset-pw.component';
import { authGuard } from './auth.guard';
import { CreateLocaleComponent } from './components/create-locale/create-locale.component';
import { CreateCompanyComponent } from './components/create-company/create-company.component';
import { createComponent } from '@angular/core';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LocalsListComponent } from './components/locals-list/locals-list.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { GuestListComponent } from './components/guest-list/guest-list.component';
import { CreateGuestListComponent } from './components/create-guest-list/create-guest-list.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { ScanComponent } from './components/scan/scan.component';

export const routes: Routes = [
  
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: AuthFormComponent  },
  { path: 'login', component: AuthFormComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'resetPW/:id', component: ResetPWComponent },
  { path: 'resetPWrequest', component: ResetPWComponent },
  { path: 'page404', component: Page404Component },
  { path: 'qrcodes/:listId/:guestId', component: QrcodeComponent },
  { path: 'invite-user', component: AuthFormComponent, canActivate: [authGuard],
    data: { roles: ['admin'] }, },
    { path: 'create-locale', component: CreateLocaleComponent, canActivate: [authGuard],
      data: { roles: ['admin'] }, },
    { path: 'create-company', component: CreateCompanyComponent, canActivate: [authGuard],
        data: { roles: ['admin'] }, },
        { path: 'create-event', component: CreateEventComponent, canActivate: [authGuard],
          data: { roles: ['admin'] }, },
          { path: 'profile', component: ProfileComponent, canActivate: [authGuard],
            data: { roles: ['admin'] }, },
            { path: 'locals-list', component: LocalsListComponent, canActivate: [authGuard],
              data: { roles: ['admin'] }, },
              { path: 'events-list', component: EventsListComponent, canActivate: [authGuard],
                data: { roles: ['admin'] }, },
                { path: 'create-guest-list', component: CreateGuestListComponent, canActivate: [authGuard],
                  data: { roles: ['admin'] }, },
                  { path: 'guest-list', component: GuestListComponent, canActivate: [authGuard],
                    data: { roles: ['admin'] }, },
                    { path: 'scan', component: ScanComponent, canActivate: [authGuard],
                      data: { roles: ['admin'] }, },

];
