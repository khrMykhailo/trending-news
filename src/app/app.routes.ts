import { Routes } from '@angular/router';
import {MainPageComponent} from "./pages/main/components/main-page/main-page.component";
import {TradingListComponent} from "./pages/main/components/trading-list/trading-list.component";

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: '',
        component: TradingListComponent
      }
    ]
  }
];
