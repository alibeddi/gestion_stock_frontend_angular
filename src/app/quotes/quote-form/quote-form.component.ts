import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Quote, QuoteService } from "../quote.service";

@Component({
  selector: "app-quote-form",
  templateUrl: "./quote-form.component.html",
  styleUrls: ["./quote-form.component.scss"],
})
export class QuoteFormComponent implements OnInit {
  quoteForm!: FormGroup;
  isEdit = false;
  isLoading = false;
  error: string | null = null;
  quoteId: number | null = null;

  modesLivraison = ["STANDARD", "EXPRESS", "RETRAIT_MAGASIN", "AUTRE"];
  delaisLivraison = [
    "IMMEDIAT",
    "SOUS_24H",
    "SOUS_48H",
    "SOUS_72H",
    "SOUS_UNE_SEMAINE",
    "AUTRE",
  ];
  modesPaiement = ["COMPTANT", "CHEQUE", "VIREMENT", "CARTE_BANCAIRE", "AUTRE"];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: QuoteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.quoteId = Number(id);
      this.fetchQuote(this.quoteId);
    }
  }

  initForm(): void {
    this.quoteForm = this.fb.group({
      sujet: ["", Validators.required],
      clientId: [null],
      prospectId: [null],
      echeance: [""],
      delaiLivraison: [""],
      modeLivraison: [""],
      modePaiement: [""],
      lignesDevis: this.fb.array([]),
    });
  }

  fetchQuote(id: number): void {
    this.isLoading = true;
    this.quoteService.getQuote(id).subscribe({
      next: (response) => {
        if (response && response.data) {
          const quote = response.data;

          // Flatten the nested objects for the form
          this.quoteForm.patchValue({
            sujet: quote.sujet,
            clientId: quote.client?.id || null,
            prospectId: quote.prospect?.id || null,
            echeance: quote.echeance
              ? new Date(quote.echeance).toISOString().split("T")[0]
              : "",
            delaiLivraison: quote.delaiLivraison || "",
            modeLivraison: quote.modeLivraison || "",
            modePaiement: quote.modePaiement || "",
          });

          // We'd need more code to handle quote lines
        } else {
          this.error = "Format de réponse inattendu";
          this.toastr.error("Format de réponse inattendu", "Erreur");
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

  onSubmit(): void {
    if (this.quoteForm.invalid) return;

    this.isLoading = true;
    this.error = null;

    const quoteData: Partial<Quote> = this.quoteForm.value;

    if (this.isEdit && this.quoteId) {
      this.quoteService.updateQuote(this.quoteId, quoteData).subscribe({
        next: (response) => {
          this.toastr.success("Devis mis à jour avec succès", "Succès");
          this.router.navigate(["/quotes"]);
        },
        error: (err) => {
          console.error("Failed to update quote", err);
          this.error = "Échec de la mise à jour du devis.";
          this.isLoading = false;
          this.toastr.error("Échec de la mise à jour du devis", "Erreur");
        },
      });
    } else {
      this.quoteService.createQuote(quoteData).subscribe({
        next: (response) => {
          this.toastr.success("Devis créé avec succès", "Succès");
          this.router.navigate(["/quotes"]);
        },
        error: (err) => {
          console.error("Failed to create quote", err);
          this.error = "Échec de la création du devis.";
          this.isLoading = false;
          this.toastr.error("Échec de la création du devis", "Erreur");
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(["/quotes"]);
  }
}
