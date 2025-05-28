import { Component, OnInit } from "@angular/core";
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/services/auth/auth.service";

interface NavItem {
  name: string;
  icon: string;
  route: string;
  requiredPermission?: string | string[];
}

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [
    { name: "Dashboard", icon: "dashboard", route: "/dashboard" },
    {
      name: "Prospects",
      icon: "person_search",
      route: "/prospects",
      requiredPermission: "prospects:read",
    },
    {
      name: "Clients",
      icon: "business",
      route: "/clients",
      requiredPermission: "clients:read",
    },
    {
      name: "Contacts",
      icon: "people",
      route: "/contacts",
      requiredPermission: "clients:read",
    },
    {
      name: "Emballages",
      icon: "inventory",
      route: "/emballages",
      requiredPermission: "products:read",
    },
    {
      name: "Produits",
      icon: "inventory_2",
      route: "/products",
      requiredPermission: "products:read",
    },
    {
      name: "Devis",
      icon: "description",
      route: "/devis",
      requiredPermission: "quotes:read",
    },
    {
      name: "Paramètres",
      icon: "settings",
      route: "/settings",
      requiredPermission: "ADMIN",
    },
  ];

  currentRoute: string = "";
  appVersion: string = environment.version || "1.0.0";
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router, private authService: AuthService) {
    // Subscribe to all router events with more specific tracking
    this.router.events.subscribe((event) => {
      console.log("Router Event Type:", event.constructor.name);

      if (event instanceof NavigationStart) {
        console.log("Navigation Started:", event.url);
      }

      if (event instanceof NavigationEnd) {
        console.log("Navigation Ended:", event.url);
        // Update current route when navigation ends
        this.currentRoute = event.urlAfterRedirects;
      }

      if (event instanceof NavigationError) {
        console.error("Navigation Error:", event.error);
      }
    });
  }

  ngOnInit(): void {
    // Initialize current route
    this.currentRoute = this.router.url;
    console.log("Initial Route:", this.currentRoute);
  }

  navigate(route: string, event?: Event): void {
    // Don't prevent default behavior - this might be causing the issue
    // Let Angular's router handle the navigation naturally

    // Log navigation attempt
    console.log("Attempting to navigate to:", route);
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  isAdmin(): boolean {
    console.log("Sidebar: Checking if user is admin");
    const isAdmin = this.authService.isAdmin();
    console.log("Sidebar: User is admin?", isAdmin);
    return isAdmin;
  }
}
