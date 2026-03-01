
import {Navbar} from './page/company/navbar/navbar';
import {Dashboard} from './page/company/dashboard/dashboard';
import {Package} from './page/company/dashboard/package/package';
import {Login} from './page/company/login/login';
import {Company} from './page/company/company';
import {Room} from './page/company/room/room';
import { Routes } from "@angular/router";
import { Admin } from "./page/admin/admin";
import { Dashboard } from "./page/admin/dashboard/dashboard";
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
        path: '',
        component: Login,
      },
      {
        path: 'navbar',
        component: Navbar,
        children: [
          {
            path: 'dashboard',
            component: Dashboard,
          },
          {
            path: 'package',
            component: Package,
          },
          {
            path: 'view',
            component: Company,
          },
          {
            path: 'room',
            component: Room,
          }
        ]
      }
    ]
  }
];
