import { Routes } from "@angular/router";
import { Admin } from "./page/admin/admin";
import { Dashboard } from "./page/admin/dashboard/dashboard";
import { Login } from "./page/company/login/login";
import { Booking } from "./page/admin/dashboard/booking/booking";
import { Company } from "./page/admin/dashboard/company/company";
import { Packages } from "./page/admin/dashboard/package/packages";
import { Room } from "./page/admin/dashboard/room/room";
import { User } from "./page/admin/dashboard/user/user";


export const routes: Routes = [
  {
    path: 'admin',
    component: Admin,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        children: [
          {
            path: 'booking',
            component: Booking
          },
          {
            path: 'company',
            component: Company
          },
          {
            path: 'package',
            component: Packages
          },
          {
            path: 'room',
            component: Room
          },
          {
            path: 'user',
            component: User
          }
        ]
      },
    ]
  },
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
