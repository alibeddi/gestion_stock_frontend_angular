import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Quote, QuoteService } from "../quote.service";

@Component({
  selector: "app-quote-detail",
  templateUrl: "./quote-detail.component.html",
  styleUrls: ["./quote-detail.component.scss"],
})
export class QuoteDetailComponent implements OnInit {
  quote: Quote | null = null;
  isLoading = false;
  error: string | null = null;
  quoteId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: QuoteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get("id"));
      if (id) {
        this.quoteId = id;
        this.fetchQuote(id);
      } else {
        this.error = "ID de devis invalide.";
      }
    });
  }

  fetchQuote(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.quoteService.getQuote(id).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.quote = response.data;
        } else {
          this.error = "Format de réponse inattendu";
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to load quote", err);
        this.error = "Échec du chargement du devis.";
        this.isLoading = false;
        this.toastr.error("Échec du chargement du devis", "Erreur");
      },
    });
  }

  getClientName(): string {
    if (!this.quote) return "N/A";

    if (this.quote.client) {
      return this.quote.client.nom || "N/A";
    } else if (this.quote.prospect) {
      return this.quote.prospect.nom || "N/A";
    }
    return "N/A";
  }

  editQuote(): void {
    if (this.quote && this.quote.id) {
      this.router.navigate(["/quotes/edit", this.quote.id]);
    }
  }

  deleteQuote(): void {
    if (!this.quote || !this.quote.id) return;

    if (confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      this.isLoading = true;
      this.quoteService.deleteQuote(this.quote.id).subscribe({
        next: (response) => {
          this.toastr.success("Devis supprimé avec succès", "Succès");
          this.router.navigate(["/quotes"]);
        },
        error: (err) => {
          console.error("Failed to delete quote", err);
          this.error = "Échec de la suppression du devis.";
          this.isLoading = false;
          this.toastr.error("Échec de la suppression du devis", "Erreur");
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(["/quotes"]);
  }
}
