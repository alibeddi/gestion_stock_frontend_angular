import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginRequest } from "../../core/models/auth/login-request";
import { AuthService } from "../../core/services/auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["../auth.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]], // Changed from username to email
      password: ["", Validators.required],
    });
  }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      const loginRequest: LoginRequest = {
        email: this.loginForm.get("email")?.value,
        password: this.loginForm.get("password")?.value,
      };

      console.log("Login request:", loginRequest);

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          console.log("Login successful, response:", response);
          console.log(
            "User data saved to localStorage:",
            this.authService.getCachedUser()
          );
          this.isLoading = false;

          // Get the returnUrl from query params or navigate to dashboard
          const returnUrl =
            this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          console.error("Login error:", error);
          this.isLoading = false;
          this.error =
            error?.error?.message ||
            "Invalid credentials or server error. Please try again.";
        },
      });
    }
  }
}
