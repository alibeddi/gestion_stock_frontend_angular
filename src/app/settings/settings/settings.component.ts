import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../core/services/auth/auth.service";

interface NavLink {
  path: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  activeTab = 0;
  navLinks: NavLink[] = [
    { path: "profile", label: "Profil", icon: "person" },
    { path: "company", label: "Entreprise", icon: "business" },
    { path: "security", label: "Sécurité", icon: "security" },
    { path: "users", label: "Utilisateurs", icon: "people", adminOnly: true },
    { path: "gouvernorats", label: "Gouvernorats", icon: "location_on", adminOnly: true },
    { path: "secteurs", label: "Secteurs d'activité", icon: "category", adminOnly: true },
    { path: "sources", label: "Sources de Prospection", icon: "source", adminOnly: true },
    { path: "paiements", label: "Modes de paiement", icon: "payment", adminOnly: true },
    { path: "roles", label: "Rôles", icon: "admin_panel_settings", adminOnly: true }
  ];
  
  filteredNavLinks: NavLink[] = [];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Filtrer les liens en fonction des droits d'accès
    this.filteredNavLinks = this.navLinks.filter(link => 
      !link.adminOnly || this.authService.isAdmin()
    );
    
    // Determine the active tab based on the current route
    const path = this.router.url.split("/").pop();
    const index = this.filteredNavLinks.findIndex((link) => link.path === path);
    if (index >= 0) {
      this.activeTab = index;
    }
  }

  onTabChange(index: number): void {
    this.router.navigate([this.filteredNavLinks[index].path], {
      relativeTo: this.route,
    });
  }
}
