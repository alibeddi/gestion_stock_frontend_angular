import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteService, Quote } from '../quote.service';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss']
})
export class QuoteDetailComponent implements OnInit {
  quote: Quote | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fetchQuote(id);
    } else {
      this.error = 'Invalid quote ID.';
    }
  }

  fetchQuote(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.quoteService.getQuote(id).subscribe({
      next: (data) => {
        this.quote = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load quote.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

