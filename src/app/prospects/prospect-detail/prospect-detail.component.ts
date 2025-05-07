import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProspectService } from '../prospect.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Prospect } from '../../core/models/prospect';

@Component({
  selector: 'app-prospect-detail',
  templateUrl: './prospect-detail.component.html',
  styleUrls: ['./prospect-detail.component.scss']
})
export class ProspectDetailComponent implements OnInit {
  prospect: Prospect | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prospectService: ProspectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProspect();
  }

  loadProspect(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID du prospect non trouvé';
      this.isLoading = false;
      return;
    }

    this.prospectService.getProspect(id).subscribe({
      next: (prospect) => {
        this.prospect = prospect;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du prospect: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  editProspect(): void {
    if (this.prospect) {
      this.router.navigate(['/prospects/edit', this.prospect.id]);
    }
  }

  deleteProspect(): void {
    if (!this.prospect) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer le prospect ${this.prospect.prenom} ${this.prospect.nom}?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.prospect) {
        this.prospectService.deleteProspect(this.prospect.id).subscribe({
          next: () => {
            this.snackBar.open('Prospect supprimé avec succès', 'Fermer', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.router.navigate(['/prospects']);
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la suppression: ' + error.message, 'Fermer', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }

  convertToClient(): void {
    if (!this.prospect) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmer la conversion',
        message: `Êtes-vous sûr de vouloir convertir ${this.prospect.prenom} ${this.prospect.nom} en client?`,
        confirmText: 'Convertir',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.prospect) {
        this.prospectService.convertToClient(this.prospect.id).subscribe({
          next: () => {
            this.snackBar.open('Prospect converti en client avec succès', 'Fermer', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.router.navigate(['/clients']);
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la conversion: ' + error.message, 'Fermer', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/prospects']);
  }
}