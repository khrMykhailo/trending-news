import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main/components/main-page/main-page.component';
import { TrendingListComponent } from './pages/main/components/trending-list/trending-list.component';

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
