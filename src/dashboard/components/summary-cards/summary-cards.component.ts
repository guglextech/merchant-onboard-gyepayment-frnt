import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCard } from '../../types/dashboard.types';

@Component({
  selector: 'app-summary-cards',
  imports: [CommonModule],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.scss',
})
export class SummaryCardsComponent {
  @Input({ required: true }) cards: SummaryCard[] = [];
}
