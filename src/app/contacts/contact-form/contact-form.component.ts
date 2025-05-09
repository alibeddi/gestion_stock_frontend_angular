import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { ApiResponse, Contact } from "../../core/models/contact.model";
import { ApiService } from "../../core/services/api.service";
import { ContactsService } from "../../core/services/contacts/contacts.service";
import { TokenService } from "../../core/services/token/token.service";

@Component({
  selector: "app-contact-form",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  contactId: number | null = null;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private contactsService: ContactsService,
    private apiService: ApiService,
    private tokenService: TokenService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.createForm();

    // Check if we're in edit mode
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.contactId = +idParam;
      this.isEditMode = true;
      this.loadContactData();
    }

    // Debug: Test API endpoints directly
    this.debugApiEndpoints();
  }

  debugApiEndpoints() {
    console.log("🔍 DEBUGGING API ENDPOINTS");
    const token = this.tokenService.getToken();

    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    // Test endpoints with raw HTTP client
    const endpoints = [
      "/api/clients",
      "/api/contacts",
      "/api/devis",
      "/api/produits",
      "/api/prospects",
    ];

    endpoints.forEach((endpoint) => {
      this.http.get(endpoint, { headers }).subscribe({
        next: (res) => console.log(`✅ Success for ${endpoint}:`, res),
        error: (err) =>
          console.error(
            `❌ Error for ${endpoint}:`,
            err.status,
            err.statusText
          ),
      });
    });

    // Test specific POST to contacts
    const testContactData = {
      nom: "Test Contact",
      email: "test@example.com",
    };

    // Try both URL formats
    this.http.post("/api/contacts", testContactData, { headers }).subscribe({
      next: (res) => console.log("✅ POST to /api/contacts succeeded:", res),
      error: (err) => {
        console.error(
          "❌ POST to /api/contacts failed:",
          err.status,
          err.statusText
        );

        // If that fails, try an alternative URL
        this.http.post("/api/contact", testContactData, { headers }).subscribe({
          next: (res) => console.log("✅ POST to /api/contact succeeded:", res),
          error: (err) =>
            console.error(
              "❌ POST to /api/contact failed too:",
              err.status,
              err.statusText
            ),
        });
      },
    });
  }

  createForm(): void {
    this.contactForm = this.fb.group({
      nom: ["", [Validators.required]],
      prenom: [""],
      fonction: [""],
      nomSociete: [""],

      mobile: [""],
      telephone: [""],
      fax: [""],

      email: ["", [Validators.required, Validators.email]],
      emailSecondaire: ["", [Validators.email]],

      siteWeb: [""],

      adresseRue: [""],
      adresseCodePostal: [""],
      adresseVille: [""],
      adressePays: [""],

      clientId: [null],
      prospectId: [null],
    });
  }

  loadContactData(): void {
    this.isLoading = true;
    this.apiService
      .get<ApiResponse<Contact>>(`/api/contacts/${this.contactId}`)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          // Handle the backend response format
          const contactData = response.data;
          this.contactForm.patchValue(contactData);
        },
        error: (error) => {
          console.error("Error loading contact", error);
          this.snackBar.open("Erreur lors du chargement du contact", "Fermer", {
            duration: 3000,
          });
        },
      });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const contactData: Contact = { ...this.contactForm.value };

    // Remove empty fields to avoid sending null or empty values that might cause validation errors
    Object.keys(contactData).forEach((key) => {
      const value = contactData[key as keyof Contact];
      if (value === "" || value === null || value === undefined) {
        delete contactData[key as keyof Contact];
      }
    });

    // Log authentication information for debugging
    const token = this.tokenService.getToken();
    const user = this.tokenService.getUser();
    console.log(
      "Authentication token:",
      token ? token.substring(0, 20) + "..." : "no token"
    );
    console.log("Current user:", user);
    console.log("Contact data to submit:", contactData);

    // Try direct HTTP request with explicit headers as a test
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    if (this.isEditMode && this.contactId) {
      // Use direct HTTP client for update
      this.http
        .put(`/api/contacts/${this.contactId}`, contactData, { headers })
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (response: any) => {
            console.log("Update response:", response);
            this.snackBar.open("Contact mis à jour avec succès", "Fermer", {
              duration: 3000,
            });
            const contactId = response?.data?.id || this.contactId;
            this.router.navigate(["/contacts", contactId]);
          },
          error: (error) => {
            console.error("Error updating contact:", error);
            this.snackBar.open(
              "Erreur lors de la mise à jour du contact",
              "Fermer",
              {
                duration: 3000,
              }
            );
          },
        });
    } else {
      // Use direct HTTP client for create
      this.http
        .post("/api/contacts", contactData, { headers })
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (response: any) => {
            console.log("Create response:", response);
            this.snackBar.open("Contact créé avec succès", "Fermer", {
              duration: 3000,
            });
            const contactId = response?.data?.id;
            if (contactId) {
              this.router.navigate(["/contacts", contactId]);
            } else {
              this.router.navigate(["/contacts"]);
            }
          },
          error: (error) => {
            console.error("Error creating contact:", error);
            this.snackBar.open(
              "Erreur lors de la création du contact",
              "Fermer",
              {
                duration: 3000,
              }
            );
          },
        });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.contactId) {
      this.router.navigate(["/contacts", this.contactId]);
    } else {
      this.router.navigate(["/contacts"]);
    }
  }
}
