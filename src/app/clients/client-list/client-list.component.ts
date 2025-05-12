import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import { Client, ClientFilter } from "../../core/models/client";
import { SecteurActivite } from "../../core/models/secteur-activite";
import { SecteurActiviteService } from "../../core/services/secteur-activite/secteur-activite.service";
import { ClientService } from "../client.service";

@Component({
  selector: "app-client-list",
  templateUrl: "./client-list.component.html",
  styleUrls: ["./client-list.component.scss"],
})
export class ClientListComponent implements OnInit {
  displayedColumns: string[] = [
    "nom",
    "matriculeFiscal",
    "email",
    "telephone",
    "secteurActivite",
    "statut",
    "actions",
  ];
  dataSource = new MatTableDataSource<Client>([]);
  filterForm: FormGroup;
  isLoading = false;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterExpanded = false;
  secteurActivites: SecteurActivite[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private router: Router,
    private secteurActiviteService: SecteurActiviteService
  ) {
    this.filterForm = this.fb.group({
      nom: [""],
      matriculeFiscal: [""],
      email: [""],
      secteurActiviteId: [""],
      sourceProspection: [""],
      statut: [""],
    });
  }

  ngOnInit(): void {
    this.loadSecteurActivites();
    this.loadClients();

    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.pageIndex = 0;
      this.loadClients();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClients() {
    this.isLoading = true;
    const filter: ClientFilter = this.filterForm.value;

    // Clean up empty filter values
    Object.keys(filter).forEach((key) => {
      if (
        filter[key as keyof ClientFilter] === "" ||
        filter[key as keyof ClientFilter] === null
      ) {
        delete filter[key as keyof ClientFilter];
      }
    });

    this.clientService
      .getClients(filter, this.pageIndex, this.pageSize)
      .subscribe({
        next: (response) => {
          let clients: Client[] = [];
          let totalElements = 0;

          // Handle possible response structures
          if (response.data) {
            clients = response.data;
            totalElements = response.totalElements || clients.length;
          } else if (response.content) {
            clients = response.content;
            totalElements = response.totalElements || clients.length;
          } else {
            clients = response || [];
            totalElements = clients.length;
          }

          this.dataSource.data = clients;
          this.totalItems = totalElements;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Error loading clients", error);
          this.isLoading = false;
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClients();
  }

  resetFilter() {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadClients();
  }

  toggleFilterPanel() {
    this.filterExpanded = !this.filterExpanded;
  }

  viewClient(id: number) {
    console.log("Navigating to client details:", id);
    this.router.navigate(["/clients", id]);
  }

  editClient(id: number) {
    console.log("Navigating to edit client:", id);
    this.router.navigate(["/clients/edit", id]);
  }

  deleteClient(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error) => {
          console.error("Error deleting client", error);
        },
      });
    }
  }

  createClient() {
    this.router.navigate(["/clients/new"]);
  }

  loadSecteurActivites(): void {
    this.secteurActiviteService.getAllSecteurs().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.secteurActivites = response.data;
        } else if (response && response.content) {
          this.secteurActivites = response.content;
        } else {
          this.secteurActivites = response || [];
        }
      },
      error: (error) => {
        console.error("Failed to load secteur activites", error);
      },
    });
  }
}
