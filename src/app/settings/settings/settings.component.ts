import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  activeTab = 0;
  navLinks = [
    { path: "profile", label: "Profil", icon: "person" },
    { path: "company", label: "Entreprise", icon: "business" },
    { path: "security", label: "Sécurité", icon: "security" },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Determine the active tab based on the current route
    const path = this.router.url.split("/").pop();
    const index = this.navLinks.findIndex((link) => link.path === path);
    if (index >= 0) {
      this.activeTab = index;
    }
  }

  onTabChange(index: number): void {
    this.router.navigate([this.navLinks[index].path], {
      relativeTo: this.route,
    });
  }
}
