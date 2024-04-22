import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { TrendingNewsApiService } from '../../services/trending-news-api.service';
import { DestroyableDirective } from '../../../shared/directives/destroyable.directive';
import {
  Comment,
  TrendingNewsItemDTO,
  TrendingNewsItemInterface,
} from '../../interfaces/trending-news-item.interface';
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
import { TrendingNewsItemComponent } from '../tranding-news-item/trending-news-item.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-trading-list',
  standalone: true,
  imports: [
    HttpClientModule,
    TrendingNewsItemComponent,
    AsyncPipe,
    NgIf,
    ButtonModule,
  ],
  providers: [TrendingNewsApiService],
  templateUrl: './trending-list.component.html',
  styleUrl: './trending-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendingListComponent
  extends DestroyableDirective
  implements OnInit
{
  public currentNewsItem: TrendingNewsItemInterface | null = null;
  public currentItemOrder = 0;

  private trandingNewsList: number[] = [];

  public get isLastItem(): boolean {
    return this.trandingNewsList.length <= this.currentItemOrder;
  }

  constructor(
    private trandingNewsApi: TrendingNewsApiService,
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

  private expandComments(item: TrendingNewsItemDTO | Comment): Observable<any> {
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

  private setFullItem(fullItem: TrendingNewsItemInterface): void {
    this.currentNewsItem = fullItem;
    this.cdr.markForCheck();
  }
}
