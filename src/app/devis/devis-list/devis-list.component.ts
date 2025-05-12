import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { Devis } from "../../core/models/devis";
import { DevisService } from "../../core/services/devis/devis.service";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-devis-list",
  templateUrl: "./devis-list.component.html",
  styleUrls: ["./devis-list.component.scss"],
})
export class DevisListComponent implements OnInit {
  displayedColumns: string[] = [
    "numeroDevis",
    "sujet",
    "client",
    "echeance",
    "totalTTC",
    "dateCreation",
    "actions",
  ];
  dataSource = new MatTableDataSource<Devis>([]);
  isLoading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private devisService: DevisService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDevis();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadDevis(): void {
    this.isLoading = true;
    this.error = null;

    this.devisService
      .getDevisList()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.dataSource.data = response.data;
          } else {
            this.error = "Format de réponse inattendu";
          }
        },
        error: (err) => {
          console.error("Error loading devis:", err);
          this.error = "Erreur lors du chargement des devis";
        },
      });
  }

  viewDevis(id: number): void {
    this.router.navigate(["/devis", id]);
  }

  editDevis(id: number): void {
    this.router.navigate(["/devis/edit", id]);
  }

  deleteDevis(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Confirmation",
        message: "Êtes-vous sûr de vouloir supprimer ce devis ?",
        confirmText: "Supprimer",
        cancelText: "Annuler",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.devisService
          .deleteDevis(id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: () => {
              this.loadDevis();
            },
            error: (err) => {
              console.error("Error deleting devis:", err);
              this.error = "Erreur lors de la suppression du devis";
            },
          });
      }
    });
  }

  formatClientName(devis: Devis): string {
    if (devis.client) {
      return devis.client.nom || "";
    } else if (devis.prospect) {
      return `${devis.prospect.nom || ""} (Prospect)`;
    }
    return "Non spécifié";
  }

  createNewDevis(): void {
    this.router.navigate(["/devis/new"]);
  }
}
