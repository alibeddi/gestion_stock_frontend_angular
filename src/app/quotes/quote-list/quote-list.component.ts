import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Quote, QuoteService } from "../quote.service";

@Component({
  selector: "app-quote-list",
  templateUrl: "./quote-list.component.html",
  styleUrls: ["./quote-list.component.scss"],
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = [];
  isLoading = false;
  error: string | null = null;

  displayedColumns: string[] = [
    "numeroDevis",
    "sujet",
    "client",
    "totalTTC",
    "dateCreation",
    "actions",
  ];

  constructor(
    private quoteService: QuoteService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchQuotes();
  }

  fetchQuotes(): void {
    this.isLoading = true;
    this.quoteService.getQuotes().subscribe({
      next: (response) => {
        // Handle the API response format which includes data in the 'data' property
        if (response && response.data) {
          this.quotes = response.data;
        } else {
          this.quotes = [];
          this.error = "Unexpected response format";
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to load quotes", err);
        this.error = "Failed to load quotes. Please try again.";
        this.isLoading = false;
        this.toastr.error("Failed to load quotes", "Error");
      },
    });
  }

  viewQuote(id: number): void {
    this.router.navigate(["/quotes", id]);
  }

  editQuote(id: number): void {
    this.router.navigate(["/quotes/edit", id]);
  }

  deleteQuote(id: number): void {
    if (!confirm("Are you sure you want to delete this quote?")) return;
    this.isLoading = true;
    this.quoteService.deleteQuote(id).subscribe({
      next: (response) => {
        this.toastr.success("Quote deleted successfully", "Success");
        this.fetchQuotes();
      },
      error: (err) => {
        console.error("Failed to delete quote", err);
        this.error = "Failed to delete quote.";
        this.isLoading = false;
        this.toastr.error("Failed to delete quote", "Error");
      },
    });
  }

  addQuote(): void {
    this.router.navigate(["/quotes/new"]);
  }

  getClientName(quote: Quote): string {
    if (quote.client) {
      return quote.client.nom || "N/A";
    } else if (quote.prospect) {
      return quote.prospect.nom || "N/A";
    }
    return "N/A";
  }
}
