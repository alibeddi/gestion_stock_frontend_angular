import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { finalize } from "rxjs/operators";
import { AuthService } from "../../core/services/auth/auth.service";

@Component({
  selector: "app-security-settings",
  templateUrl: "./security-settings.component.html",
  styleUrls: ["./security-settings.component.scss"],
})
export class SecuritySettingsComponent {
  passwordForm: FormGroup;
  isLoading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required, Validators.minLength(8)]],
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get("newPassword")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      control.get("confirmPassword")?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isLoading = true;
    const passwordData = this.passwordForm.value;

    this.authService
      .changePassword(passwordData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          console.log("Password changed successfully");
          this.snackBar.open("Mot de passe modifié avec succès", "Fermer", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          });

          // Reset form
          this.passwordForm.reset();
        },
        error: (error: any) => {
          console.error("Error changing password:", error);
          let errorMessage = "Erreur lors de la modification du mot de passe";

          if (error.error && error.error.message) {
            if (error.error.message.includes("current password")) {
              errorMessage = "Le mot de passe actuel est incorrect";
            }
          }

          this.snackBar.open(errorMessage, "Fermer", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          });
        },
      });
  }
}
