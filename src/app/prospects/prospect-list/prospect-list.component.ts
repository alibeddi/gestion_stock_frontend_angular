import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Prospect, ProspectFilter } from '../../core/models/prospect';
import { ProspectService } from '../prospect.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prospect-list',
  templateUrl: './prospect-list.component.html',
  styleUrls: ['./prospect-list.component.scss']
})
export class ProspectListComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'email', 'telephone', 'secteurActivite', 'potentiel', 'dateProchainContact', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Prospect>([]);
  filterForm: FormGroup;
  isLoading = false;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterExpanded = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private prospectService: ProspectService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.filterForm = this.fb.group({
      nom: [''],
      matriculeFiscale: [''],
      email: [''],
      secteurActivite: [''],
      sourceProspection: [''],
      statut: [''],
      potentiel: [''],
      responsableProspection: ['']
    });
  }

  ngOnInit(): void {
    this.loadProspects();
    
    this.filterForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadProspects();
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProspects() {
    this.isLoading = true;
    const filter: ProspectFilter = this.filterForm.value;
    
    this.prospectService.getProspects(filter, this.pageIndex, this.pageSize)
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.content;
          this.totalItems = response.totalElements;
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error('Erreur lors du chargement des prospects', 'Erreur');
          console.error('Error loading prospects', error);
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProspects();
  }

  resetFilter() {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadProspects();
  }

  toggleFilterPanel() {
    this.filterExpanded = !this.filterExpanded;
  }

  viewProspect(id: number) {
    this.router.navigate(['/prospects', id]);
  }

  editProspect(id: number) {
    this.router.navigate(['/prospects', id, 'edit']);
  }

  deleteProspect(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) {
      this.prospectService.deleteProspect(id).subscribe({
        next: () => {
          this.toastr.success('Prospect supprimé avec succès', 'Succès');
          this.loadProspects();
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la suppression du prospect', 'Erreur');
          console.error('Error deleting prospect', error);
        }
      });
    }
  }

  convertToClient(id: number) {
    if (confirm('Êtes-vous sûr de vouloir convertir ce prospect en client ?')) {
      this.prospectService.convertToClient(id).subscribe({
        next: () => {
          this.toastr.success('Prospect converti en client avec succès', 'Succès');
          this.loadProspects();
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la conversion du prospect', 'Erreur');
          console.error('Error converting prospect', error);
        }
      });
    }
  }

  createProspect() {
    this.router.navigate(['/prospects/new']);
  }
}