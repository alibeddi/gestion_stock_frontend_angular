import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../user.service';
import { Role, RoleService } from '../../settings/role/role.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEdit = false;
  isLoading = false;
  error: string | null = null;
  userId: number | null = null;
  roles: Role[] = [];
  hidePassword = true; // For password visibility toggle

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
    
    // Load available roles
    this.loadRoles();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userId = Number(id);
      this.fetchUser(this.userId);
      
      // Remove password validation for edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => {
        console.error('Error loading roles', error);
        this.error = 'Failed to load roles.';
      }
    });
  }

  fetchUser(id: number): void {
    this.isLoading = true;
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load user.';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/settings/users']);
  }
 
  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.isLoading = true;
    this.error = null;
    const userData = this.userForm.value;
    if (this.isEdit && this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe({
        next: () => {
          this.router.navigate(['/settings/users']);
        },
        error: (error) => {
          console.error('Update error:', error);
          this.error = error?.error?.message || 'Failed to update user.';
          this.isLoading = false;
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.router.navigate(['/settings/users']);
        },
        error: (error) => {
          console.error('Creation error:', error);
          this.error = error?.error?.message || 'Failed to create user.';
          this.isLoading = false;
        }
      });
    }
  }
}

