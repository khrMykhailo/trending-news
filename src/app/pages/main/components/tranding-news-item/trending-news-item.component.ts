import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Comment } from '../../interfaces/trending-news-item.interface';
import { AccordionModule } from 'primeng/accordion';
import {
  DatePipe,
  JsonPipe,
  NgForOf,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';

@Component({
  selector: 'app-tranding-news-item',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    AccordionModule,
    NgForOf,
    JsonPipe,
    NgTemplateOutlet,
    NgIf,
    DatePipe,
  ],
  templateUrl: './trending-news-item.component.html',
  styleUrl: './trending-news-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendingNewsItemComponent {
  @Input() item!: any;
  trackByComment(index: number, comment: Comment) {
    return comment.id;
  }
}