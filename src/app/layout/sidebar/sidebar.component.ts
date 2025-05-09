import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/services/auth/auth.service";

interface NavItem {
  name: string;
  icon: string;
  route: string;
  requiredPermission?: string;
}

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [
    { name: "Dashboard", icon: "dashboard", route: "/dashboard" },
    { name: "Products", icon: "inventory_2", route: "/products" },
    { name: "Clients", icon: "business", route: "/clients" },
    { name: "Prospects", icon: "person_search", route: "/prospects" },
    { name: "Quotes", icon: "description", route: "/quotes" },
    { name: "Contacts", icon: "people", route: "/contacts" },
    {
      name: "Users",
      icon: "admin_panel_settings",
      route: "/users",
      requiredPermission: "ADMIN",
    },
  ];

  currentRoute: string = "";
  appVersion: string = environment.version || "1.0.0";
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router, private authService: AuthService) {
    // Subscribe to all router events to debug
    this.router.events.subscribe((event) => {
      console.log("Router Event:", event);
    });
  }

  ngOnInit(): void {
    // Track current route for highlighting active navigation item
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        console.log("Navigation End Event:", event);
        this.currentRoute = event.urlAfterRedirects;
      });

    // Initialize current route
    this.currentRoute = this.router.url;
    console.log("Initial Route:", this.currentRoute);
  }

  navigate(route: string): void {
    // Force navigation programmatically in addition to routerLink
    console.log("Navigating to:", route);
    this.router.navigateByUrl(route).then(
      (success) => console.log("Navigation result:", success),
      (error) => console.error("Navigation error:", error)
    );
  }

  hasPermission(permission?: string): boolean {
    if (!permission) return true;
    return this.authService.hasRole(permission);
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }
}
