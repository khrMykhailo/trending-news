import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { TrandingNewsApiService } from '../../services/tranding-news-api.service';
import { DestroyableDirective } from '../../../shared/directives/destroyable.directive';
import { TradingNewsItemInterface } from '../../interfaces/trading-news-item.interface';
import {
  catchError,
  concatMap,
  from,
  map,
  Observable,
  of,
  switchMap,
  takeUntil,
  toArray,
} from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { AsyncPipe, NgIf } from '@angular/common';
import { TrandingNewsItemComponent } from '../tranding-news-item/tranding-news-item.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-trading-list',
  standalone: true,
  imports: [
    HttpClientModule,
    TrandingNewsItemComponent,
    AsyncPipe,
    NgIf,
    ButtonModule,
  ],
  providers: [TrandingNewsApiService],
  templateUrl: './trading-list.component.html',
  styleUrl: './trading-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingListComponent
  extends DestroyableDirective
  implements OnInit
{
  public currentNewsItem: TradingNewsItemInterface | null = null;
  public currentItemOrder = 0;

  private trandingNewsList: number[] = [];

  public get isLastItem(): boolean {
    return this.trandingNewsList.length <= this.currentItemOrder;
  }

  constructor(
    private trandingNewsApi: TrandingNewsApiService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit() {
    this.getFullList();
  }

  public nextItem() {
    this.currentNewsItem = null;
    this.currentItemOrder++;
    this.getItem(this.trandingNewsList[this.currentItemOrder]);
  }

  public previousItem() {
    this.currentNewsItem = null;
    this.currentItemOrder--;
    this.getItem(this.trandingNewsList[this.currentItemOrder]);
  }
  private getFullList(): void {
    this.trandingNewsApi
      .getAllNews()
      .pipe(
        switchMap((list) => {
          this.trandingNewsList = list;
          return this.trandingNewsApi.getNewsItem(
            this.trandingNewsList[this.currentItemOrder],
          );
        }),
        switchMap((item) => this.expandComments(item)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe({
        next: (fullItem) => {
          this.setFullItem(fullItem);
        },
      });
  }

  private getItem(id: number): void {
    this.trandingNewsApi
      .getNewsItem(id)
      .pipe(
        switchMap((item) => this.expandComments(item)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe({
        next: (fullItem) => {
          this.setFullItem(fullItem);
        },
      });
  }

  private expandComments(item: any): Observable<any> {
    if (!item.kids || item.kids.length === 0) {
      return of(item);
    }

    return from(item.kids).pipe(
      concatMap((kidId) => this.trandingNewsApi.getComments(kidId as number)),
      switchMap((comment) => this.expandComments(comment)),
      toArray(),
      map((nestedComments) => ({
        ...item,
        comments: nestedComments,
        kids: undefined,
      })),
      catchError((error) => {
        console.error('Error fetching comments:', error);
        return of({ ...item, comments: [] });
      }),
    );
  }

  private setFullItem(fullItem: TradingNewsItemInterface): void {
    this.currentNewsItem = fullItem;
    this.cdr.markForCheck();
  }
}
