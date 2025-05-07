import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  isEdit = false;
  isLoading = false;
  error: string | null = null;
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clientId = Number(id);
      this.fetchClient(this.clientId);
    }
  }

  fetchClient(id: number): void {
    this.isLoading = true;
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.clientForm.patchValue(client);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load client.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;
    this.isLoading = true;
    this.error = null;
    const clientData = this.clientForm.value;
    if (this.isEdit && this.clientId) {
      this.clientService.updateClient(this.clientId, clientData).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: () => {
          this.error = 'Failed to update client.';
          this.isLoading = false;
        }
      });
    } else {
      this.clientService.createClient(clientData).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: () => {
          this.error = 'Failed to create client.';
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/clients']);
  }
}

