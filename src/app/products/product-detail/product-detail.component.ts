import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { Product, ProductService } from "../product.service";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (id) {
      this.fetchProduct(id);
    } else {
      this.error = "ID de produit invalide";
    }
  }

  fetchProduct(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.productService
      .getProduct(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.product = response.data;
          } else {
            this.error = "Format de réponse inattendu";
          }
        },
        error: (error) => {
          console.error("Error loading product:", error);
          this.error = "Erreur lors du chargement du produit";
        },
      });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) {
      return "Non spécifié";
    }
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  goBack(): void {
    this.router.navigate(["/products"]);
  }
}
