import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { Contact } from "../../core/models/contact.model";
import { ContactsService } from "../../core/services/contacts/contacts.service";

@Component({
  selector: "app-contact-detail",
  templateUrl: "./contact-detail.component.html",
  styleUrls: ["./contact-detail.component.scss"],
})
export class ContactDetailComponent implements OnInit {
  contactId: number | null = null;
  contact: Contact | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private contactsService: ContactsService
  ) {}

  ngOnInit(): void {
    this.contactId = +this.route.snapshot.paramMap.get("id")!;
    this.loadContact();
  }

  loadContact(): void {
    this.isLoading = true;
    this.contactsService
      .getContactById(this.contactId!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.contact = response.data;
        },
        error: (error) => {
          console.error("Error loading contact", error);
          this.snackBar.open("Erreur lors du chargement du contact", "Fermer", {
            duration: 3000,
          });
        },
      });
  }

  editContact(): void {
    this.router.navigate(["/contacts/edit", this.contactId]);
  }

  goBack(): void {
    this.router.navigate(["/contacts"]);
  }

  deleteContact(): void {
    const confirmDelete = confirm(
      "Êtes-vous sûr de vouloir supprimer ce contact ?"
    );
    if (confirmDelete) {
      this.contactsService.deleteContact(this.contactId!).subscribe({
        next: () => {
          this.snackBar.open("Contact supprimé avec succès", "Fermer", {
            duration: 3000,
          });
          this.router.navigate(["/contacts"]);
        },
        error: (error) => {
          console.error("Error deleting contact", error);
          this.snackBar.open(
            "Erreur lors de la suppression du contact",
            "Fermer",
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }
}
