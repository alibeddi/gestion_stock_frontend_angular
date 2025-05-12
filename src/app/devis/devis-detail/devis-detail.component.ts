import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { Devis } from "../../core/models/devis";
import { DevisService } from "../../core/services/devis/devis.service";

@Component({
  selector: "app-devis-detail",
  templateUrl: "./devis-detail.component.html",
  styleUrls: ["./devis-detail.component.scss"],
})
export class DevisDetailComponent implements OnInit {
  devis: Devis | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private devisService: DevisService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (id) {
      this.loadDevis(id);
    } else {
      this.error = "ID de devis invalide";
    }
  }

  loadDevis(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.devisService
      .getDevisById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.devis = response.data;
          } else {
            this.error = "Format de réponse inattendu";
          }
        },
        error: (err) => {
          console.error("Error loading devis:", err);
          this.error = "Erreur lors du chargement du devis";
        },
      });
  }

  goBack(): void {
    this.router.navigate(["/devis"]);
  }

  editDevis(): void {
    if (this.devis && this.devis.id) {
      this.router.navigate(["/devis/edit", this.devis.id]);
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) {
      return "Non spécifié";
    }
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
