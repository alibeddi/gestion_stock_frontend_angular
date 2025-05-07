import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuoteService, Quote } from '../quote.service';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = [];
  isLoading = false;
  error: string | null = null;

  displayedColumns: string[] = ['id', 'clientName', 'total', 'date', 'status', 'actions'];

  constructor(private quoteService: QuoteService, private router: Router) {}

  ngOnInit(): void {
    this.fetchQuotes();
  }

  fetchQuotes(): void {
    this.isLoading = true;
    this.quoteService.getQuotes().subscribe({
      next: (data) => {
        this.quotes = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load quotes.';
        this.isLoading = false;
      }
    });
  }

  viewQuote(id: number): void {
    this.router.navigate(['/quotes/quote-detail', id]);
  }

  editQuote(id: number): void {
    this.router.navigate(['/quotes/quote-form', id]);
  }

  deleteQuote(id: number): void {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    this.isLoading = true;
    this.quoteService.deleteQuote(id).subscribe({
      next: () => {
        this.fetchQuotes();
      },
      error: () => {
        this.error = 'Failed to delete quote.';
        this.isLoading = false;
      }
    });
  }

  addQuote(): void {
    this.router.navigate(['/quotes/quote-form']);
  }
}

