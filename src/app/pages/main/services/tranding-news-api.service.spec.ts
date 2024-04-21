import { TestBed } from '@angular/core/testing';

import { TrandingNewsApiService } from './tranding-news-api.service';

describe('TrandingNewsApiService', () => {
  let service: TrandingNewsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrandingNewsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
