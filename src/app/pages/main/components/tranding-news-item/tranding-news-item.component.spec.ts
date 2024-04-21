import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrandingNewsItemComponent } from './tranding-news-item.component';

describe('TrandingNewsItemComponent', () => {
  let component: TrandingNewsItemComponent;
  let fixture: ComponentFixture<TrandingNewsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrandingNewsItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrandingNewsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
