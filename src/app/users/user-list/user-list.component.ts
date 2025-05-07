import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;

  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'actions'];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.isLoading = false;
      }
    });
  }

  viewUser(id: number): void {
    this.router.navigate(['/users/user-detail', id]);
  }

  editUser(id: number): void {
    this.router.navigate(['/users/user-form', id]);
  }

  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.isLoading = true;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.fetchUsers();
      },
      error: () => {
        this.error = 'Failed to delete user.';
        this.isLoading = false;
      }
    });
  }

  addUser(): void {
    this.router.navigate(['/users/user-form']);
  }
}

