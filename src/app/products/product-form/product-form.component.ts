import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import {
  Emballage,
  EmballageService,
} from "../../core/services/emballage/emballage.service";
import { Product, ProductService } from "../product.service";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.scss"],
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEdit = false;
  isLoading = false;
  error: string | null = null;
  productId: number | null = null;
  emballages: Emballage[] = [];
  loadingEmballages = false;

  // Options for dropdown menus
  typeProduitOptions = ["Standard", "Premium", "Économique", "Autre"];
  categorieOptions = [
    "Alimentaire",
    "Électronique",
    "Vêtements",
    "Mobilier",
    "Autre",
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private emballageService: EmballageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEmballages();

    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.productId = Number(id);
      this.fetchProduct(this.productId);
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      code: ["", Validators.required],
      libelle: ["", Validators.required],
      emballage: [null],
      categorie: [""],
      poidsKg: [null, Validators.min(0)],
      typeProduit: [""],
      actif: [true],
      isPackage: [false],
      ecozit: [false],
      prixDetail: [0, [Validators.required, Validators.min(0)]],
      prixGerant: [0, [Validators.required, Validators.min(0)]],
      prixGros: [0, [Validators.required, Validators.min(0)]],
      description: [""],
      quantity: [0, [Validators.required, Validators.min(0)]],
    });
  }

  loadEmballages(): void {
    this.loadingEmballages = true;
    this.emballageService
      .getAllEmballages()
      .pipe(finalize(() => (this.loadingEmballages = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.emballages = response.data;
          }
        },
        error: (error) => {
          console.error("Error loading emballages:", error);
        },
      });
  }

  fetchProduct(id: number): void {
    this.isLoading = true;
    this.productService
      .getProduct(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            const product = response.data;

            // Handle emballage separately
            const emballageId = product.emballage?.id;
            // Use any type to bypass TypeScript checking for form values
            const formValue: any = { ...product };

            // Set the emballage dropdown value
            if (emballageId) {
              formValue.emballage = emballageId;
            } else {
              formValue.emballage = null;
            }

            this.productForm.patchValue(formValue);
          } else {
            console.error("Invalid response format:", response);
            this.error = "Format de réponse inattendu";
          }
        },
        error: (error) => {
          console.error("Error loading product:", error);
          this.error = "Erreur lors du chargement du produit";
        },
      });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.isLoading = true;
    this.error = null;

    const formValue = this.productForm.value;
    const productData: Product = { ...formValue };

    // Convert emballage ID to emballage object if selected
    if (formValue.emballage) {
      const emballageId = formValue.emballage;
      productData.emballage = { id: emballageId } as Emballage;
    } else {
      productData.emballage = undefined;
    }

    const operation: Observable<any> =
      this.isEdit && this.productId
        ? this.productService.updateProduct(this.productId, productData)
        : this.productService.createProduct(productData);

    operation.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        const message = this.isEdit
          ? "Produit modifié avec succès"
          : "Produit créé avec succès";

        this.snackBar.open(message, "Fermer", {
          duration: 3000,
        });

        this.router.navigate(["/products"]);
      },
      error: (error) => {
        console.error("Error saving product:", error);
        this.error = this.isEdit
          ? "Erreur lors de la modification du produit"
          : "Erreur lors de la création du produit";
      },
    });
  }

  compareEmballages(e1: any, e2: any): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }

  cancel(): void {
    this.router.navigate(["/products"]);
  }
}
