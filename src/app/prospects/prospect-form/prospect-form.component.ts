import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ProspectService } from "../prospect.service";

@Component({
  selector: "app-prospect-form",
  templateUrl: "./prospect-form.component.html",
  styleUrls: ["./prospect-form.component.scss"],
})
export class ProspectFormComponent implements OnInit {
  prospectForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  prospectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private prospectService: ProspectService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.prospectForm = this.fb.group({
      nom: ["", Validators.required],
      email: ["", [Validators.email]],
      telephone: [""],
      adresse: this.fb.group({
        rue: [""],
        ville: [""],
        codePostal: [""],
        pays: [""],
      }),
      secteurActiviteId: [null],
      sourceProspectionId: [null],
      statut: ["NOUVEAU"],
      potentiel: ["MOYEN"],
      commentaire: [""],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEditMode = true;
      this.prospectId = +id;
      this.loadProspect(this.prospectId);
    }
  }

  loadProspect(id: number): void {
    this.isLoading = true;
    this.prospectService.getProspectById(id).subscribe({
      next: (prospect) => {
        this.prospectForm.patchValue(prospect);
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error("Erreur lors du chargement du prospect", "Erreur");
        console.error("Error loading prospect", error);
        this.isLoading = false;
      },
    });
  }

  saveProspect(): void {
    if (this.prospectForm.invalid) {
      this.toastr.error(
        "Veuillez corriger les erreurs dans le formulaire",
        "Erreur"
      );
      return;
    }

    this.isLoading = true;
    const prospectData = this.prospectForm.value;

    if (this.isEditMode && this.prospectId) {
      this.prospectService
        .updateProspect(this.prospectId, prospectData)
        .subscribe({
          next: () => {
            this.toastr.success("Prospect mis à jour avec succès", "Succès");
            this.router.navigate(["/prospects"]);
            this.isLoading = false;
          },
          error: (error) => {
            this.toastr.error(
              "Erreur lors de la mise à jour du prospect",
              "Erreur"
            );
            console.error("Error updating prospect", error);
            this.isLoading = false;
          },
        });
    } else {
      this.prospectService.createProspect(prospectData).subscribe({
        next: () => {
          this.toastr.success("Prospect créé avec succès", "Succès");
          this.router.navigate(["/prospects"]);
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error("Erreur lors de la création du prospect", "Erreur");
          console.error("Error creating prospect", error);
          this.isLoading = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(["/prospects"]);
  }
}
