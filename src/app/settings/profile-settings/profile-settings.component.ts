import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { finalize } from "rxjs/operators";
import { AuthService } from "../../core/services/auth/auth.service";
import {
  SettingsService,
  UserSettings,
} from "../../core/services/settings/settings.service";

@Component({
  selector: "app-profile-settings",
  templateUrl: "./profile-settings.component.html",
  styleUrls: ["./profile-settings.component.scss"],
})
export class ProfileSettingsComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  currentUser: any;
  userSettings: UserSettings | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      position: [""],
      language: ["fr"],
      notificationEmail: [true],
      notificationSms: [false],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    console.log("Loading user data...");

    // Get current user info
    this.authService.getCurrentUser().subscribe({
      next: (userData: any) => {
        console.log("User data received:", userData);
        if (userData && userData.data) {
          this.currentUser = userData.data;

          // Load user settings
          this.settingsService
            .getCurrentUserSettings()
            .pipe(
              finalize(() => {
                this.isLoading = false;
                console.log("Settings loading complete");
              })
            )
            .subscribe({
              next: (response: any) => {
                console.log("User settings received:", response);
                if (response && response.data) {
                  this.userSettings = response.data;

                  // Populate form with user data and settings
                  this.profileForm.patchValue({
                    firstName: this.currentUser.prenom,
                    lastName: this.currentUser.nom,
                    email: this.currentUser.email,
                    phone: this.currentUser.telephone || "",
                    position: this.currentUser.titre || "",
                    language: this.userSettings?.language || "fr",
                    notificationEmail:
                      this.userSettings?.notificationEmail || true,
                    notificationSms:
                      this.userSettings?.notificationSms || false,
                  });
                } else {
                  // No settings found, use user data only
                  this.profileForm.patchValue({
                    firstName: this.currentUser.prenom,
                    lastName: this.currentUser.nom,
                    email: this.currentUser.email,
                    phone: this.currentUser.telephone || "",
                    position: this.currentUser.titre || "",
                  });
                }
              },
              error: (error: any) => {
                console.error("Error loading user settings:", error);

                // Still populate form with user data
                this.profileForm.patchValue({
                  firstName: this.currentUser.prenom,
                  lastName: this.currentUser.nom,
                  email: this.currentUser.email,
                  phone: this.currentUser.telephone || "",
                  position: this.currentUser.titre || "",
                });

                this.snackBar.open(
                  "Erreur lors du chargement des paramètres",
                  "Fermer",
                  {
                    duration: 3000,
                  }
                );
              },
            });
        } else {
          console.error("Invalid user data format:", userData);
          this.isLoading = false;
          this.snackBar.open(
            "Format de données utilisateur invalide",
            "Fermer",
            {
              duration: 3000,
            }
          );
        }
      },
      error: (error: any) => {
        console.error("Error loading user data:", error);
        this.isLoading = false;
        this.snackBar.open(
          "Erreur lors du chargement des données utilisateur",
          "Fermer",
          {
            duration: 3000,
          }
        );
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.profileForm.value;

    // Prepare user settings data
    const settingsData: UserSettings = {
      userId: this.currentUser.id,
      language: formData.language,
      notificationEmail: formData.notificationEmail,
      notificationSms: formData.notificationSms,
    };

    // Update user settings
    const settingsOperation = this.userSettings?.id
      ? this.settingsService.updateUserSettings(
          this.currentUser.id,
          settingsData
        )
      : this.settingsService.createUserSettings(settingsData);

    settingsOperation.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.userSettings = response.data;
        }
        this.snackBar.open("Profil mis à jour avec succès", "Fermer", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
        });
      },
      error: (error: any) => {
        console.error("Error saving user settings:", error);
        this.snackBar.open(
          "Erreur lors de la mise à jour du profil",
          "Fermer",
          {
            duration: 3000,
          }
        );
      },
    });
  }
}
