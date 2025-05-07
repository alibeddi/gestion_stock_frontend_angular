import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteService, Quote } from '../quote.service';

@Component({
  selector: 'app-quote-form',
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.scss']
})
export class QuoteFormComponent implements OnInit {
  quoteForm!: FormGroup;
  isEdit = false;
  isLoading = false;
  error: string | null = null;
  quoteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {
    this.quoteForm = this.fb.group({
      clientName: ['', Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      status: ['', Validators.required]
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.quoteId = Number(id);
      this.fetchQuote(this.quoteId);
    }
  }

  fetchQuote(id: number): void {
    this.isLoading = true;
    this.quoteService.getQuote(id).subscribe({
      next: (quote) => {
        this.quoteForm.patchValue(quote);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load quote.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.quoteForm.invalid) return;
    this.isLoading = true;
    this.error = null;
    const quoteData = this.quoteForm.value;
    if (this.isEdit && this.quoteId) {
      this.quoteService.updateQuote(this.quoteId, quoteData).subscribe({
        next: () => {
          this.router.navigate(['/quotes']);
        },
        error: () => {
          this.error = 'Failed to update quote.';
          this.isLoading = false;
        }
      });
    } else {
      this.quoteService.createQuote(quoteData).subscribe({
        next: () => {
          this.router.navigate(['/quotes']);
        },
        error: () => {
          this.error = 'Failed to create quote.';
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/quotes']);
  }
}

