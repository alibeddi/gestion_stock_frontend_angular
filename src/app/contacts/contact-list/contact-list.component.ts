import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { Contact } from "../../core/models/contact.model";
import { ContactsService } from "../../core/services/contacts/contacts.service";

@Component({
  selector: "app-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrls: ["./contact-list.component.scss"],
})
export class ContactListComponent implements OnInit {
  displayedColumns: string[] = [
    "nom",
    "email",
    "telephone",
    "nomSociete",
    "actions",
  ];
  dataSource: Contact[] = [];
  isLoading = false;
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = "";

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private contactsService: ContactsService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.contactsService
      .getContacts(this.currentPage, this.pageSize, this.searchTerm)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.dataSource = response.data;
          this.totalItems = response.total;
        },
        error: (error) => {
          console.error("Error loading contacts", error);
          this.snackBar.open(
            "Erreur lors du chargement des contacts",
            "Fermer",
            {
              duration: 3000,
            }
          );
        },
      });
  }

  applyFilter(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1; // Reset to first page on new search
    this.loadContacts();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  addContact(): void {
    this.router.navigate(["/contacts/new"]);
  }

  editContact(id: number): void {
    this.router.navigate(["/contacts/edit", id]);
  }

  viewContact(id: number): void {
    this.router.navigate(["/contacts", id]);
  }

  deleteContact(id: number): void {
    const confirmDelete = confirm(
      "Êtes-vous sûr de vouloir supprimer ce contact ?"
    );
    if (confirmDelete) {
      this.contactsService.deleteContact(id).subscribe({
        next: () => {
          this.snackBar.open("Contact supprimé avec succès", "Fermer", {
            duration: 3000,
          });
          this.loadContacts();
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
