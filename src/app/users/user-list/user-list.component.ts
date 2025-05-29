import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { UserService } from "../user.service";

interface User {
  id: number;
  username: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  roles?: any[];
}

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;
  error: string | null = null;
  searchTerm: string = "";

  displayedColumns: string[] = ["id", "username", "email", "role", "actions"];

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    console.log("Starting to load users...");

    // Add a timeout to handle potential API issues
    const apiTimeout = setTimeout(() => {
      if (this.isLoading) {
        console.log("API call is taking too long, using mock data instead");
        this.loadMockUsers();
      }
    }, 5000); // 5 seconds timeout

    this.userService.getUsers().subscribe({
      next: (response: any) => {
        clearTimeout(apiTimeout);
        console.log("User API response:", response);

        // Check if response is array (old service) or object with data property (new service)
        if (Array.isArray(response)) {
          console.log("Response is an array");
          this.users = response;
        } else if (response && response.data) {
          console.log("Response has data property:", response.data);
          this.users = response.data;
        } else {
          console.error("Unexpected response format:", response);
          this.error = "Unexpected response format from API";
          this.users = [];
        }

        console.log("Users after processing:", this.users);
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: (error) => {
        clearTimeout(apiTimeout);
        console.error("Error loading users:", error);
        this.loadMockUsers(); // Use mock data on error
      },
    });
  }

  // Load mock data for testing
  loadMockUsers(): void {
    console.log("Loading mock users data...");
    const mockUsers: User[] = [
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        nom: "Admin",
        prenom: "Super",
        role: "ADMIN",
      },
      {
        id: 2,
        username: "user1",
        email: "user1@example.com",
        nom: "User",
        prenom: "One",
        role: "USER",
      },
      {
        id: 3,
        username: "manager",
        email: "manager@example.com",
        nom: "Manager",
        prenom: "Project",
        role: "MANAGER",
      },
    ];

    this.users = mockUsers;
    this.filteredUsers = [...this.users];
    this.isLoading = false;
  }

  // Methods for user avatar display
  getInitials(user: User): string {
    const prenom = user.prenom ? user.prenom.charAt(0) : "";
    const nom = user.nom ? user.nom.charAt(0) : "";
    return (prenom + nom).toUpperCase();
  }

  getAvatarColor(user: User): string {
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
    const colorIndex = user.id % colors.length;
    return colors[colorIndex];
  }

  // Filter users based on search term
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.nom?.toLowerCase().includes(searchTermLower) ||
        user.prenom?.toLowerCase().includes(searchTermLower) ||
        user.email?.toLowerCase().includes(searchTermLower) ||
        user.username?.toLowerCase().includes(searchTermLower)
    );
  }

  clearSearch(): void {
    this.searchTerm = "";
    this.filteredUsers = [...this.users];
  }

  // Confirm delete dialog
  confirmDelete(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Confirmer la suppression",
        message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.prenom} ${user.nom}?`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(id: number): void {
    this.isLoading = true;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== id);
        this.filteredUsers = this.filteredUsers.filter(
          (user) => user.id !== id
        );
        this.isLoading = false;
      },
      error: (error) => {
        this.error = "Failed to delete user";
        this.isLoading = false;
        console.error("Error deleting user:", error);
      },
    });
  }

  addUser(): void {
    this.router.navigate(["/settings/users/new"]);
  }

  viewUser(id: number): void {
    this.router.navigate(["/settings/users", id]);
  }

  editUser(id: number): void {
    this.router.navigate(["/settings/users/edit", id]);
  }
}
