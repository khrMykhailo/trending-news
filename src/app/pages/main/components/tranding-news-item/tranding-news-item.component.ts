import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TradingNewsItemInterface } from '../../interfaces/trading-news-item.interface';
import { AccordionModule } from 'primeng/accordion';
import { JsonPipe, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  ],
  templateUrl: './tranding-news-item.component.html',
  styleUrl: './tranding-news-item.component.scss',
})
export class TrandingNewsItemComponent implements OnInit {
  @Input() item!: any;
  public sanitizedUrl: SafeResourceUrl;

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit() {
    this.sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      'https://external.com/iframe.html',
    );
  }
}
