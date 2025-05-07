import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Create the form without the custom validator first
    this.registerForm = this.fb.group({
      // username field removed
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      matricule: ['', Validators.required],
      telephone: [''],
      mobile: [''],
      titre: [''],
      adresse: ['']
    });

    // Add password match validation separately
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
    
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }

  // Check if passwords match and set error if they don't
  checkPasswordMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        this.registerForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      } else {
        // Only clear the passwordMismatch error, not other errors
        const errors = this.registerForm.get('confirmPassword')?.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          const hasOtherErrors = Object.keys(errors).length > 0;
          this.registerForm.get('confirmPassword')?.setErrors(hasOtherErrors ? errors : null);
        }
      }
    }
  }

  onSubmit(): void {
    console.log('Form submitted, valid:', this.registerForm.valid);
    console.log('Form errors:', this.getFormValidationErrors());
    
    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Get all form values
    const registerData = {
      // username field removed
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword,
      nom: this.registerForm.value.nom,
      prenom: this.registerForm.value.prenom,
      matricule: this.registerForm.value.matricule,
      telephone: this.registerForm.value.telephone || '',
      mobile: this.registerForm.value.mobile || '',
      titre: this.registerForm.value.titre || '',
      adresse: this.registerForm.value.adresse || ''
    };

    console.log('Sending registration data:', registerData);

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response);
        // Navigate to login page after successful registration
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        // Display error message
        const errorMessage = 
          error.error?.message || 
          'Registration failed. Please try again.';
        this.error = errorMessage;
      }
    });
  }

  // Helper method to mark all controls as touched to trigger validation
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper method to get all validation errors for debugging
  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.registerForm.controls).forEach(key => {
      const controlErrors = this.registerForm.get(key)?.errors;
      if (controlErrors) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }
}
