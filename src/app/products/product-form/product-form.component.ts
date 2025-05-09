import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../product.service";

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      code: ["", Validators.required],
      libelle: ["", Validators.required],
      description: [""],
      prixDetail: [0, [Validators.required, Validators.min(0)]],
      prixGerant: [0, [Validators.required, Validators.min(0)]],
      prixGros: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
    });
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.productId = Number(id);
      this.fetchProduct(this.productId);
    }
  }

  fetchProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.isLoading = false;
      },
      error: () => {
        this.error = "Failed to load product.";
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    this.isLoading = true;
    this.error = null;
    const productData = this.productForm.value;
    if (this.isEdit && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.router.navigate(["/products"]);
        },
        error: () => {
          this.error = "Failed to update product.";
          this.isLoading = false;
        },
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.router.navigate(["/products"]);
        },
        error: () => {
          this.error = "Failed to create product.";
          this.isLoading = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(["/products"]);
  }
}
