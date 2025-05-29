import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { User, UserService } from "../user.service";

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.scss"],
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  error: string | null = null;
  userId: number = 0;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get("id");
      if (idParam) {
        this.userId = +idParam;
        this.loadUser();
      } else {
        this.error = "ID utilisateur manquant";
        this.isLoading = false;
      }
    });
  }

  loadUser(): void {
    this.isLoading = true;
    this.error = null;

    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading user:", error);
        this.error = "Impossible de charger les détails de l'utilisateur";
        this.isLoading = false;
      },
    });
  }

  editUser(): void {
    this.router.navigate(["/settings/users/edit", this.userId]);
  }

  confirmDelete(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Confirmer la suppression",
        message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${this.user.prenom} ${this.user.nom}?`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser();
      }
    });
  }

  deleteUser(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.router.navigate(["/settings/users"]);
      },
      error: (error) => {
        console.error("Error deleting user:", error);
        this.error = "Impossible de supprimer l'utilisateur";
        this.isLoading = false;
      },
    });
  }

  getInitials(): string {
    if (!this.user) return "";
    const prenom = this.user.prenom ? this.user.prenom.charAt(0) : "";
    const nom = this.user.nom ? this.user.nom.charAt(0) : "";
    return (prenom + nom).toUpperCase();
  }

  getAvatarColor(): string {
    if (!this.user) return "#cccccc";
    // Generate a deterministic color based on user id
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffc107",
      "#ff9800",
      "#ff5722",
    ];
    const colorIndex = this.user.id % colors.length;
    return colors[colorIndex];
  }

  goBack(): void {
    this.router.navigate(["/settings/users"]);
  }
}
