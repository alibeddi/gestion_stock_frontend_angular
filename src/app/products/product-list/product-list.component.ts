import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { Product, ProductService } from "../product.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = [
    "code",
    "libelle",
    "categorie",
    "prix",
    "actif",
    "actions",
  ];
  dataSource = new MatTableDataSource<Product>([]);
  isLoading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.error = null;

    this.productService
      .getProducts()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.dataSource.data = response.data;
          } else {
            this.error = "Format de réponse inattendu";
          }
        },
        error: (error) => {
          console.error("Error loading products:", error);
          this.error = "Erreur lors du chargement des produits";
        },
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addProduct(): void {
    this.router.navigate(["/products/new"]);
  }

  editProduct(id: number): void {
    this.router.navigate(["/products/edit", id]);
  }

  viewProduct(id: number): void {
    this.router.navigate(["/products/detail", id]);
  }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: {
        title: "Confirmation de suppression",
        message: "Êtes-vous sûr de vouloir supprimer ce produit ?",
        confirmButton: "Supprimer",
        cancelButton: "Annuler",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;

        this.productService
          .deleteProduct(id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: () => {
              this.snackBar.open("Produit supprimé avec succès", "Fermer", {
                duration: 3000,
              });
              this.fetchProducts();
            },
            error: (error) => {
              console.error("Error deleting product:", error);
              this.snackBar.open(
                "Erreur lors de la suppression du produit",
                "Fermer",
                {
                  duration: 3000,
                }
              );
            },
          });
      }
    });
  }

  refreshList(): void {
    this.fetchProducts();
  }
}
