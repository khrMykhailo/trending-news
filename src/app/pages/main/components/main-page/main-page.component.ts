import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {SplitButtonModule} from "primeng/splitbutton";
import {DestroyableDirective} from "../../../shared/directives/destroyable.directive";
import {map, takeUntil} from "rxjs";
import {InputTextModule} from "primeng/inputtext";
import {SidebarModule} from "primeng/sidebar";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    InputTextModule,
    SidebarModule,
    NgIf
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent extends DestroyableDirective{
  darkModeActive: boolean = false;
  visibleSidebar: boolean = false;
  searchValue: string = ''
  loading: boolean = false;
  cityError: boolean = false;

  constructor(
  ) {
    super()
  }

  searchNews() {

  }
}
