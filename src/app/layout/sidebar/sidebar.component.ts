import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth/auth.service';

interface NavItem {
  name: string;
  icon: string;
  route: string;
  requiredPermission?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Products', icon: 'inventory_2', route: '/products' },
    { name: 'Categories', icon: 'category', route: '/categories' },
    { name: 'Suppliers', icon: 'business', route: '/suppliers' },
    {
      name: 'Purchase Orders',
      icon: 'shopping_cart',
      route: '/purchase-orders',
    },
    { name: 'Sales', icon: 'point_of_sale', route: '/sales' },
    { name: 'Customers', icon: 'people', route: '/customers' },
    // --- Add these two lines below ---
    { name: 'Clients', icon: 'person', route: '/clients' },
    { name: 'Prospects', icon: 'person_search', route: '/prospects' },
    // --- End of addition ---
    {
      name: 'Reports',
      icon: 'assessment',
      route: '/reports',
      requiredPermission: 'VIEW_REPORTS',
    },
    {
      name: 'Users',
      icon: 'admin_panel_settings',
      route: '/users',
      requiredPermission: 'MANAGE_USERS',
    },
    { name: 'Settings', icon: 'settings', route: '/settings' },
  ];

  currentRoute: string = '';
  appVersion: string = environment.version || '1.0.0';
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Track current route for highlighting active navigation item
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });

    // Initialize current route
    this.currentRoute = this.router.url;
  }

  hasPermission(permission?: string): boolean {
    if (!permission) return true;
    return this.authService.hasRole(permission);
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }
}
