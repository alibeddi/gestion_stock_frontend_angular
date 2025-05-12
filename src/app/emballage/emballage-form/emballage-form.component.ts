import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import {
  Emballage,
  EmballageService,
} from "../../core/services/emballage/emballage.service";

@Component({
  selector: "app-emballage-form",
  templateUrl: "./emballage-form.component.html",
  styleUrls: ["./emballage-form.component.scss"],
})
export class EmballageFormComponent implements OnInit {
  emballageForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  emballageId: number | null = null;
  pageTitle = "Ajouter un emballage";

  typeEmballageOptions = [
    "Carton",
    "Plastique",
    "Verre",
    "Métal",
    "Bois",
    "Autre",
  ];

  constructor(
    private fb: FormBuilder,
    private emballageService: EmballageService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.emballageForm = this.fb.group({
      code: ["", [Validators.required, Validators.maxLength(50)]],
      libelle: ["", [Validators.required, Validators.maxLength(100)]],
      poids: [null, [Validators.min(0)]],
      typeEmballage: [""],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.emballageId = +id;
      this.isEditMode = true;
      this.pageTitle = "Modifier l'emballage";
      this.loadEmballage(this.emballageId);
    }
  }

  loadEmballage(id: number): void {
    this.isLoading = true;

    this.emballageService
      .getEmballageById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.emballageForm.patchValue({
              code: response.data.code,
              libelle: response.data.libelle,
              poids: response.data.poids,
              typeEmballage: response.data.typeEmballage,
            });
          } else {
            this.snackBar.open(
              "Erreur lors du chargement de l'emballage",
              "Fermer",
              {
                duration: 3000,
              }
            );
            this.navigateToList();
          }
        },
        error: (error) => {
          console.error("Error loading emballage:", error);
          this.snackBar.open(
            "Erreur lors du chargement de l'emballage",
            "Fermer",
            {
              duration: 3000,
            }
          );
          this.navigateToList();
        },
      });
  }

  onSubmit(): void {
    if (this.emballageForm.invalid) {
      return;
    }

    this.isLoading = true;
    const emballageData: Emballage = this.emballageForm.value;

    const operation =
      this.isEditMode && this.emballageId
        ? this.emballageService.updateEmballage(this.emballageId, emballageData)
        : this.emballageService.createEmballage(emballageData);

    operation.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        const message = this.isEditMode
          ? "Emballage modifié avec succès"
          : "Emballage ajouté avec succès";

        this.snackBar.open(message, "Fermer", {
          duration: 3000,
        });

        this.navigateToList();
      },
      error: (error) => {
        console.error("Error saving emballage:", error);

        let errorMessage = "Erreur lors de l'enregistrement de l'emballage";

        if (error.error && error.error.message) {
          if (
            error.error.message.includes("code") &&
            error.error.message.includes("unique")
          ) {
            errorMessage = "Ce code d'emballage existe déjà";
          }
        }

        this.snackBar.open(errorMessage, "Fermer", {
          duration: 3000,
        });
      },
    });
  }

  navigateToList(): void {
    this.router.navigate(["/emballages"]);
  }

  resetForm(): void {
    if (this.isEditMode && this.emballageId) {
      this.loadEmballage(this.emballageId);
    } else {
      this.emballageForm.reset();
    }
  }
}
