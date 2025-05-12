import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Client } from "../../core/models/client";
import { ClientService } from "../client.service";

@Component({
  selector: "app-client-detail",
  templateUrl: "./client-detail.component.html",
  styleUrls: ["./client-detail.component.scss"],
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (id) {
      this.fetchClient(id);
    } else {
      this.error = "ID client invalide.";
    }
  }

  fetchClient(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.clientService.getClientById(id).subscribe({
      next: (response: any) => {
        // Check if the response has a data property (API wrapper)
        let clientData = response;
        if (response && response.data) {
          clientData = response.data;
        }

        if (!clientData) {
          this.error =
            "Les données du client n'ont pas été chargées correctement.";
          this.isLoading = false;
          return;
        }

        // Force data type conversion if needed
        if (
          clientData.dateLimiteExoneration &&
          typeof clientData.dateLimiteExoneration === "string"
        ) {
          clientData.dateLimiteExoneration = new Date(
            clientData.dateLimiteExoneration
          );
        }

        this.client = clientData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading client:", error);
        this.error = "Échec du chargement du client. Veuillez réessayer.";
        this.isLoading = false;
      },
    });
  }

  getReadableModeReglement(mode: string | undefined): string {
    if (!mode) return "Non défini";

    switch (mode) {
      case "ESPECE":
        return "Espèces";
      case "CHEQUE":
        return "Chèque";
      case "VIREMENT":
        return "Virement";
      case "CARTE_BANCAIRE":
        return "Carte bancaire";
      case "LETTRE_CREDIT":
        return "Lettre de crédit";
      case "TRAITE":
        return "Traite";
      default:
        return mode;
    }
  }

  getReadablePrixAchat(prix: string | undefined): string {
    if (!prix) return "Non défini";

    switch (prix) {
      case "PRIX_GROS":
        return "Prix de gros";
      case "PRIX_DETAIL":
        return "Prix de détail";
      case "PRIX_GERANT":
        return "Prix gérant";
      default:
        return prix;
    }
  }

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return "Non défini";

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj instanceof Date && !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString("fr-FR")
        : "Non défini";
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Non défini";
    }
  }

  goBack(): void {
    this.router.navigate(["/clients"]);
  }
}
