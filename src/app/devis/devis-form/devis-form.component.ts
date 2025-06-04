import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { ClientService } from "src/app/clients/client.service";
import { ProspectService } from "src/app/prospects/prospect.service";
import { DevisService } from "../../core/services/devis/devis.service";

@Component({
  selector: "app-devis-form",
  templateUrl: "./devis-form.component.html",
  styleUrls: ["./devis-form.component.scss"],
})
export class DevisFormComponent implements OnInit {
  devisForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  editMode = false;
  devisId: number | null = null;
  clients: any[] = [];
  prospects: any[] = [];

  constructor(
    private fb: FormBuilder,
    private devisService: DevisService,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private prospectService: ProspectService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
    this.loadProspects();
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.editMode = true;
      this.devisId = Number(id);
      this.loadDevis(this.devisId);
    }
  }

  initForm(): void {
    this.devisForm = this.fb.group({
      sujet: ["", Validators.required],
      client: [null],
      prospect: [null],
      echeance: [null],
      delaiLivraison: [null],
      modeLivraison: [null],
      modePaiement: [null],
    });
  }
  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (response) => {
        this.clients = response.data || [];
      },
      error: (error) => {
        this.error = "Error loading clients";
        console.error("Error loading clients:", error);
      },
    });
  }
  loadProspects(): void {
    this.prospectService.getProspects().subscribe({
      next: (response) => {
        this.prospects = response.data || [];
      },
      error: (error) => {
        this.error = "Error loading prospects";
        console.error("Error loading prospects:", error);
      },
    });
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
            this.devisForm.patchValue(response.data);
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

  onSubmit(): void {
    if (this.devisForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValues = this.devisForm.value;

    // Create a new devis object with properly formatted client and prospect
    const devis = {
      ...formValues,
      client: formValues.client ? { id: formValues.client } : null,
      prospect: formValues.prospect ? { id: formValues.prospect } : null,
    };

    const request =
      this.editMode && this.devisId
        ? this.devisService.updateDevis(this.devisId, devis)
        : this.devisService.createDevis(devis);

    request.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: () => {
        this.router.navigate(["/devis"]);
      },
      error: (err) => {
        console.error("Error saving devis:", err);
        this.error = "Erreur lors de l'enregistrement du devis";
      },
    });
  }

  goBack(): void {
    this.router.navigate(["/devis"]);
  }
}
