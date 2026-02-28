
import {Navbar} from './page/company/navbar/navbar';
import {Dashboard} from './page/company/dashboard/dashboard';
import {Package} from './page/company/dashboard/package/package';
import {Routes} from '@angular/router';
import {Login} from './page/company/login/login';
import {Company} from './page/company/company';
import {Room} from './page/company/room/room';
export const routes: Routes = [
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
