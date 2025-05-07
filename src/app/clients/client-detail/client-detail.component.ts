import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../client.service';
import { Client } from '../../core/models/client';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fetchClient(id);
    } else {
      this.error = 'Invalid client ID.';
    }
  }

  fetchClient(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.clientService.getClientById(id).subscribe({
      next: (data) => {
        this.client = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load client.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

