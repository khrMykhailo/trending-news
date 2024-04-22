import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main/components/main-page/main-page.component';
import { TrendingListComponent } from './pages/main/components/trading-list/trending-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: '',
        component: TrendingListComponent,
      },
    ],
  },
];
