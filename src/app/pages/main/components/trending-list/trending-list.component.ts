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
  ItemsSimpleStore,
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
import { TrendingNewsItemComponent } from '../trending-news-item/trending-news-item.component';
import { ButtonModule } from 'primeng/button';
import { GetItemState } from '../../interfaces/get-item-state.enum';

@Component({
  selector: 'app-trending-list',
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
  public currentItemOrder = 0;
  public itemsStore: ItemsSimpleStore = {
    previousItem: null,
    currentItem: null,
    nextItem: null,
  };

  private trendingNewsList: number[] = [];

  public get isLastItem(): boolean {
    return this.trendingNewsList.length <= this.currentItemOrder;
  }

  constructor(
    private trendingNewsApi: TrendingNewsApiService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit() {
    this.getFullList();
  }

  public nextItem() {
    this.currentItemOrder++;
    this.itemsStore.previousItem = this.itemsStore.currentItem;
    this.itemsStore.currentItem = this.itemsStore.nextItem;
    this.itemsStore.nextItem = null;
    this.cdr.markForCheck();
    this.getItem(
      this.trendingNewsList[this.currentItemOrder + 1],
      GetItemState.NEXT,
    );
  }

  public previousItem() {
    this.currentItemOrder--;
    this.itemsStore.nextItem = this.itemsStore.currentItem;
    this.itemsStore.currentItem = this.itemsStore.previousItem;
    this.itemsStore.previousItem = null;
    this.cdr.markForCheck();
    this.getItem(
      this.trendingNewsList[this.currentItemOrder - 1],
      GetItemState.PREVIOUS,
    );
  }
  private getFullList(): void {
    this.trendingNewsApi
      .getAllNews()
      .pipe(
        switchMap((list) => {
          this.trendingNewsList = list;
          return this.trendingNewsApi.getNewsItem(
            this.trendingNewsList[this.currentItemOrder],
          );
        }),
        switchMap((item) => this.expandComments(item)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe({
        next: (fullItem) => {
          this.setCurrentItem(fullItem as TrendingNewsItemInterface);
          this.getItem(
            this.trendingNewsList[this.currentItemOrder + 1],
            GetItemState.NEXT,
          );
        },
      });
  }

  private getItem(
    id: number,
    state: GetItemState = GetItemState.CURRENT,
  ): void {
    this.trendingNewsApi
      .getNewsItem(id)
      .pipe(
        switchMap((item) => this.expandComments(item)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe({
        next: (fullItem) => {
          if (state === GetItemState.CURRENT) {
            this.setCurrentItem(fullItem as TrendingNewsItemInterface);
          } else if (state === GetItemState.PREVIOUS) {
            this.setPreviousItem(fullItem as TrendingNewsItemInterface);
          } else if (state === GetItemState.NEXT) {
            this.setNextItem(fullItem as TrendingNewsItemInterface);
          }
        },
      });
  }

  private expandComments(
    item: TrendingNewsItemDTO | Comment,
  ): Observable<Comment | TrendingNewsItemDTO | TrendingNewsItemInterface> {
    if (!item.kids || item.kids.length === 0) {
      return of(item);
    }

    return from(item.kids).pipe(
      concatMap((kidId) => this.trendingNewsApi.getComments(kidId as number)),
      switchMap((comment) => this.expandComments(comment)),
      toArray(),
      map((nestedComments) => {
        delete item.kids;
        return {
          ...item,
          comments: nestedComments,
        } as TrendingNewsItemInterface;
      }),
      catchError((error) => {
        console.error('Error fetching comments:', error);
        return of({ ...item, comments: [] });
      }),
    );
  }

  private setCurrentItem(fullItem: TrendingNewsItemInterface): void {
    this.itemsStore.currentItem = fullItem;
    this.cdr.markForCheck();
  }

  private setPreviousItem(item: TrendingNewsItemInterface): void {
    this.itemsStore.previousItem = item;
    this.cdr.markForCheck();
  }
  private setNextItem(item: TrendingNewsItemInterface): void {
    this.itemsStore.nextItem = item;
    this.cdr.markForCheck();
  }
}
