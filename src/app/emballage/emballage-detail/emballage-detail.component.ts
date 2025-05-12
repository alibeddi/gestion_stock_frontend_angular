import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import {
  Emballage,
  EmballageService,
} from "../../core/services/emballage/emballage.service";

@Component({
  selector: "app-emballage-detail",
  templateUrl: "./emballage-detail.component.html",
  styleUrls: ["./emballage-detail.component.scss"],
})
export class EmballageDetailComponent implements OnInit {
  emballage: Emballage | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private emballageService: EmballageService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.loadEmballage(+id);
    } else {
      this.error = "ID d'emballage non fourni";
    }
  }

  loadEmballage(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.emballageService
      .getEmballageById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.emballage = response.data;
          } else {
            this.error = "Emballage non trouvé";
          }
        },
        error: (error) => {
          console.error("Error loading emballage:", error);
          this.error = "Erreur lors du chargement de l'emballage";
        },
      });
  }

  editEmballage(): void {
    if (this.emballage) {
      this.router.navigate(["/emballages/edit", this.emballage.id]);
    }
  }

  goBack(): void {
    this.router.navigate(["/emballages"]);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
