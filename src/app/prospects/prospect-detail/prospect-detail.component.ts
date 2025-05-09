import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, of } from "rxjs";
import { Prospect } from "../../core/models/prospect";
import { ProspectService } from "../prospect.service";

@Component({
  selector: "app-prospect-detail",
  templateUrl: "./prospect-detail.component.html",
  styleUrls: ["./prospect-detail.component.scss"],
})
export class ProspectDetailComponent implements OnInit {
  prospect: Prospect | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prospectService: ProspectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProspect();
  }

  loadProspect(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.error = "ID du prospect non trouvé";
      this.isLoading = false;
      return;
    }

    this.prospectService
      .getProspectById(Number(id))
      .pipe(
        catchError((err) => {
          this.error =
            "Erreur lors du chargement du prospect: " +
            (err.message || "Erreur inconnue");
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((prospect) => {
        if (prospect) {
          this.prospect = prospect;
        }
        this.isLoading = false;
      });
  }

  editProspect(): void {
    if (this.prospect && this.prospect.id) {
      this.router.navigate(["/prospects/edit", this.prospect.id]);
    }
  }

  deleteProspect(): void {
    if (!this.prospect || !this.prospect.id) return;

    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le prospect ${this.prospect.nom}?`
      )
    ) {
      this.prospectService
        .deleteProspect(this.prospect.id)
        .pipe(
          catchError((err) => {
            this.snackBar.open(
              "Erreur lors de la suppression: " +
                (err.message || "Erreur inconnue"),
              "Fermer",
              {
                duration: 5000,
                horizontalPosition: "end",
                verticalPosition: "top",
              }
            );
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response !== null) {
            this.snackBar.open("Prospect supprimé avec succès", "Fermer", {
              duration: 3000,
              horizontalPosition: "end",
              verticalPosition: "top",
            });
            this.router.navigate(["/prospects"]);
          }
        });
    }
  }

  convertToClient(): void {
    if (!this.prospect || !this.prospect.id) return;

    if (
      window.confirm(
        `Êtes-vous sûr de vouloir convertir ${this.prospect.nom} en client?`
      )
    ) {
      this.prospectService
        .convertToClient(this.prospect.id)
        .pipe(
          catchError((err) => {
            this.snackBar.open(
              "Erreur lors de la conversion: " +
                (err.message || "Erreur inconnue"),
              "Fermer",
              {
                duration: 5000,
                horizontalPosition: "end",
                verticalPosition: "top",
              }
            );
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response !== null) {
            this.snackBar.open(
              "Prospect converti en client avec succès",
              "Fermer",
              {
                duration: 3000,
                horizontalPosition: "end",
                verticalPosition: "top",
              }
            );
            this.router.navigate(["/clients"]);
          }
        });
    }
  }

  goBack(): void {
    this.router.navigate(["/prospects"]);
  }
}
