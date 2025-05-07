import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Client, ClientFilter } from '../../core/models/client';
import { ClientService } from '../client.service';


@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'matriculeFiscale', 'email', 'telephone', 'secteurActivite', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Client>([]);
  filterForm: FormGroup;
  isLoading = false;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterExpanded = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private router: Router,
  
  ) {
    this.filterForm = this.fb.group({
      nom: [''],
      matriculeFiscale: [''],
      email: [''],
      secteurActivite: [''],
      sourceProspection: [''],
      statut: ['']
    });
  }

  ngOnInit(): void {
    this.loadClients();
    
    this.filterForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
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
    
    this.clientService.getClients(filter, this.pageIndex, this.pageSize)
      .subscribe({
        next: (response) => {

          const clients = response.data ?? [];
         
          this.dataSource.data = clients;
          this.totalItems = response.totalElements ?? clients.length ?? 0;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading clients', error);
          this.isLoading = false;
        }
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
    this.router.navigate(['/clients', id]);
  }

  editClient(id: number) {
    this.router.navigate(['/clients', id, 'edit']);
  }

  deleteClient(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {

          this.loadClients();
        },
        error: (error) => {

          console.error('Error deleting client', error);
        }
      });
    }
  }

  createClient() {
    this.router.navigate(['/clients/new']);
  }
}

