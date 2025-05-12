import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Gouvernorat } from "../../core/models/gouvernorat";
import { SecteurActivite } from "../../core/models/secteur-activite";
import { GouvernoratService } from "../../core/services/gouvernorat/gouvernorat.service";
import { SecteurActiviteService } from "../../core/services/secteur-activite/secteur-activite.service";
import { ClientService } from "../client.service";

@Component({
  selector: "app-client-form",
  templateUrl: "./client-form.component.html",
  styleUrls: ["./client-form.component.scss"],
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  isEdit = false;
  isLoading = false;
  error: string | null = null;
  clientId: number | null = null;

  secteurActivites: SecteurActivite[] = [];
  gouvernorats: Gouvernorat[] = [];
  modesReglement: string[] = [
    "ESPECE",
    "CHEQUE",
    "VIREMENT",
    "CARTE_BANCAIRE",
    "LETTRE_CREDIT",
    "TRAITE",
  ];
  prixAchats: string[] = ["PRIX_GROS", "PRIX_DETAIL", "PRIX_GERANT"];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private secteurActiviteService: SecteurActiviteService,
    private gouvernoratService: GouvernoratService
  ) {}

  ngOnInit(): void {
    // Initialize form first
    this.initForm();

    // Load reference data with proper callback handling
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.clientId = Number(id);

      // Create promises for loading the reference data
      const secteurPromise = new Promise<void>((resolve) => {
        this.loadSecteurActivites(() => resolve());
      });

      const gouvernoratPromise = new Promise<void>((resolve) => {
        this.loadGouvernorats(() => resolve());
      });

      // When both promises are resolved, fetch the client
      Promise.all([secteurPromise, gouvernoratPromise]).then(() => {
        if (this.clientId !== null) {
          this.fetchClient(this.clientId);
        }
      });
    } else {
      // Not in edit mode, just load the reference data normally
      this.loadSecteurActivites();
      this.loadGouvernorats();
    }
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      nom: ["", Validators.required],
      numeroCompte: [""],
      numeroSousCompte: [""],
      matriculeFiscal: [""],
      chiffreAffaires: [null],
      effectif: [null],
      secteurActivite: [null],
      exonere: [false],
      dateLimiteExoneration: [null],
      modeReglement: [null],
      prixAchat: [null],
      gouvernorat: [null],
      mobile: [""],
      telephone: [""],
      autreTelephone: [""],
      fax: [""],
      email: ["", [Validators.email]],
      autreEmail: ["", [Validators.email]],
      siteWeb: [""],
      adresseRue: [""],
      adresseCodePostal: [""],
      adresseVille: [""],
      adressePays: [""],
    });
  }

  loadSecteurActivites(callback?: () => void): void {
    this.secteurActiviteService.getAllSecteurs().subscribe({
      next: (response) => {
        // Handle the API response structure correctly
        if (response && response.data) {
          this.secteurActivites = response.data;
        } else if (response && response.content) {
          this.secteurActivites = response.content;
        } else {
          this.secteurActivites = response || [];
        }

        if (callback) callback();
      },
      error: (error) => {
        console.error("Failed to load secteur activites:", error);
        this.error = "Erreur lors du chargement des secteurs d'activité.";
        if (callback) callback();
      },
    });
  }

  loadGouvernorats(callback?: () => void): void {
    this.gouvernoratService.getAllGouvernorats().subscribe({
      next: (response) => {
        // Handle the API response structure correctly
        if (response && response.data) {
          this.gouvernorats = response.data;
        } else if (response && response.content) {
          this.gouvernorats = response.content;
        } else {
          this.gouvernorats = response || [];
        }

        if (callback) callback();
      },
      error: (error) => {
        console.error("Failed to load gouvernorats:", error);
        this.error = "Erreur lors du chargement des gouvernorats.";
        if (callback) callback();
      },
    });
  }

  fetchClient(id: number): void {
    this.isLoading = true;
    this.clientService.getClientById(id).subscribe({
      next: (response: any) => {
        // Extract client data if it's wrapped in a response object
        let clientData = response;
        if (response && response.data) {
          clientData = response.data;
        }

        console.log("Client data received:", clientData);

        // Apply the data to the form with a slight delay to ensure Angular Material is ready
        setTimeout(() => {
          this.patchFormWithClient(clientData);
        }, 100);
      },
      error: (error) => {
        console.error("Failed to load client:", error);
        this.error = "Échec du chargement du client.";
        this.isLoading = false;
      },
    });
  }

  patchFormWithClient(client: any): void {
    try {
      console.log("Patching form with client:", client);
      console.log("Available secteur activites:", this.secteurActivites);
      console.log("Available gouvernorats:", this.gouvernorats);

      // For dropdown objects, find the matching object in the loaded arrays
      let secteurToSelect = null;
      let gouvernoratToSelect = null;

      // For objects, we need to find the matching objects by ID
      if (client.secteurActivite && client.secteurActivite.id) {
        secteurToSelect = this.secteurActivites.find(
          (s) => s.id === client.secteurActivite.id
        );
        console.log("Selected secteur:", secteurToSelect);
      }

      if (client.gouvernorat && client.gouvernorat.id) {
        gouvernoratToSelect = this.gouvernorats.find(
          (g) => g.id === client.gouvernorat.id
        );
        console.log("Selected gouvernorat:", gouvernoratToSelect);
      }

      // Create a modified object to patch the form
      // First make a clean copy of the client without the complex objects
      const cleanClientData = { ...client };
      delete cleanClientData.secteurActivite;
      delete cleanClientData.gouvernorat;

      // Create a patched value object with proper reference objects
      const patchedValues = {
        ...cleanClientData,
        secteurActivite: secteurToSelect,
        gouvernorat: gouvernoratToSelect,
      };

      // Apply the values to the form
      this.clientForm.patchValue(patchedValues);
      console.log("Form values after patch:", this.clientForm.value);

      // Force form controls to recognize they have values immediately
      // Instead of waiting for change detection
      Object.keys(this.clientForm.controls).forEach((key) => {
        const control = this.clientForm.get(key);
        if (control && control.value) {
          control.markAsTouched();
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });

      // Apply a second round of updates after a short delay to ensure Angular Material has updated
      setTimeout(() => {
        Object.keys(this.clientForm.controls).forEach((key) => {
          const control = this.clientForm.get(key);
          if (control && control.value) {
            control.markAsTouched();
            control.markAsDirty();
            control.updateValueAndValidity();
          }
        });

        this.clientForm.markAsDirty();
        this.clientForm.updateValueAndValidity();
        this.isLoading = false;
      }, 300);
    } catch (err) {
      console.error("Error patching form:", err);
      this.error = "Erreur lors du chargement des données du formulaire.";
      this.isLoading = false;
    }
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      console.log("Form is invalid:", this.clientForm.errors);
      return;
    }

    this.isLoading = true;
    this.error = null;
    const clientData = this.clientForm.value;
    console.log("Submitting client data:", clientData);

    if (this.isEdit && this.clientId) {
      this.clientService.updateClient(this.clientId, clientData).subscribe({
        next: (response) => {
          console.log("Client updated successfully:", response);
          this.router.navigate(["/clients"]);
        },
        error: (error) => {
          console.error("Failed to update client", error);
          this.error = "Échec de la mise à jour du client.";
          this.isLoading = false;
        },
      });
    } else {
      this.clientService.createClient(clientData).subscribe({
        next: (response) => {
          console.log("Client created successfully:", response);
          this.router.navigate(["/clients"]);
        },
        error: (error) => {
          console.error("Failed to create client", error);
          this.error = "Échec de la création du client.";
          this.isLoading = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(["/clients"]);
  }
}
