import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { finalize } from "rxjs/operators";
import {
  CompanySettings,
  SettingsService,
} from "../../core/services/settings/settings.service";

@Component({
  selector: "app-company-settings",
  templateUrl: "./company-settings.component.html",
  styleUrls: ["./company-settings.component.scss"],
})
export class CompanySettingsComponent implements OnInit {
  companyForm: FormGroup;
  isLoading = false;
  companySettings: CompanySettings | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
  ) {
    this.companyForm = this.fb.group({
      companyName: ["", Validators.required],
      taxId: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      address: ["", Validators.required],
      postalCode: [""],
      city: ["", Validators.required],
      country: ["Tunisie", Validators.required],
      website: [""],
      logoUrl: [""],
      currency: ["TND"],
    });
  }

  ngOnInit(): void {
    this.loadCompanySettings();
  }

  loadCompanySettings(): void {
    this.isLoading = true;

    this.settingsService
      .getCompanySettings()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.companySettings = response.data;

            if (this.companySettings) {
              this.companyForm.patchValue({
                companyName: this.companySettings.companyName || "",
                taxId: this.companySettings.taxId || "",
                email: this.companySettings.email || "",
                phone: this.companySettings.phone || "",
                address: this.companySettings.address || "",
                postalCode: this.companySettings.postalCode || "",
                city: this.companySettings.city || "",
                country: this.companySettings.country || "Tunisie",
                website: this.companySettings.website || "",
                logoUrl: this.companySettings.logoUrl || "",
                currency: this.companySettings.currency || "TND",
              });
            }
          }
        },
        error: (error: any) => {
          console.error("Error loading company settings:", error);
          this.snackBar.open(
            "Erreur lors du chargement des paramètres de l'entreprise",
            "Fermer",
            {
              duration: 3000,
            }
          );
        },
      });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.companyForm.value;

    // Prepare company settings data
    const settingsData: CompanySettings = {
      companyName: formData.companyName,
      taxId: formData.taxId,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      postalCode: formData.postalCode,
      city: formData.city,
      country: formData.country,
      website: formData.website,
      logoUrl: formData.logoUrl,
      currency: formData.currency,
    };

    // Update or create company settings
    const settingsOperation = this.companySettings?.id
      ? this.settingsService.updateCompanySettings(
          this.companySettings.id,
          settingsData
        )
      : this.settingsService.createCompanySettings(settingsData);

    settingsOperation.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.companySettings = response.data;
        }
        this.snackBar.open(
          "Informations de l'entreprise mises à jour avec succès",
          "Fermer",
          {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          }
        );
      },
      error: (error: any) => {
        console.error("Error saving company settings:", error);
        this.snackBar.open(
          "Erreur lors de la mise à jour des informations de l'entreprise",
          "Fermer",
          {
            duration: 3000,
          }
        );
      },
    });
  }
}
