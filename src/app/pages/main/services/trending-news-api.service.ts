import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TrendingNewsItemDTO,
  Comment,
} from '../interfaces/trending-news-item.interface';

@Injectable()
export class TrendingNewsApiService {
  private url = 'https://hacker-news.firebaseio.com/v0';

  constructor(private http: HttpClient) {}

  public getAllNews(): Observable<number[]> {
    return this.http.get<number[]>(`${this.url}/topstories.json`);
  }

  public getNewsItem(id: number): Observable<TrendingNewsItemDTO> {
    return this.http.get<TrendingNewsItemDTO>(`${this.url}/item/${id}.json`);
  }
  public getComments(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.url}/item/${id}.json`);
  }
}
