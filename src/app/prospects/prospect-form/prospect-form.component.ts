import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ProspectService } from "../prospect.service";
import { SecteurActiviteService } from "src/app/core/services/secteur-activite/secteur-activite.service";
import { SourceProspectionService } from "src/app/core/services/source-prospection/source-prospection.service";

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
  sources: any[] = [];
  secteurs: any[] = [];

  constructor(
    private fb: FormBuilder,
    private prospectService: ProspectService,
    private router: Router,
    private route: ActivatedRoute,
  private sourcesService: SourceProspectionService, // Ajoutez cette ligne :
    private secteurService: SecteurActiviteService
  
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
    this.loadSourceProspection();
      this.loadSecteurs();
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
        console.error("Error loading prospect", error);
        this.isLoading = false;
      },
    });
  }
  loadSourceProspection(): void {
   
    this.sourcesService.getAllSources().subscribe({
      next: (prospect) => {
       this.sources = prospect.data || [];
        
      },
      error: (error) => {
        console.error("Error loading prospect", error);
        this.isLoading = false;
      },
    });
  }
  loadSecteurs(): void {
    this.secteurService.getAllSecteurs().subscribe({
      next: (response) => {
        this.secteurs = response.data || [];
      },
      error: (error) => {
        console.error("Error loading secteurs", error);
      },
    });
  }

  saveProspect(): void {
    if (this.prospectForm.invalid) {
    
      return;
    }

    this.isLoading = true;
    const prospectData = this.prospectForm.value;

    if (this.isEditMode && this.prospectId) {
      this.prospectService
        .updateProspect(this.prospectId, prospectData)
        .subscribe({
          next: () => {
            this.router.navigate(["/prospects"]);
            this.isLoading = false;
          },
          error: (error) => {
           
            console.error("Error updating prospect", error);
            this.isLoading = false;
          },
        });
    } else {
      this.prospectService.createProspect(prospectData).subscribe({
        next: () => {
          this.router.navigate(["/prospects"]);
          this.isLoading = false;
        },
        error: (error) => {
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
