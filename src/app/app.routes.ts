import { Routes } from '@angular/router';
import {Dashboard} from './page/company/dashboard/dashboard';
import {Login} from './page/company/login/login';

export const routes: Routes = [
  {
    path: 'company',
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'login',
        component: Login
      },
      {
        path: '',
        redirectTo: '/company/login',
        pathMatch: 'full'
      }
    ]
  }
];
