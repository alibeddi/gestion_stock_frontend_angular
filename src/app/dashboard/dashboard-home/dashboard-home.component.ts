import { Component, OnInit } from '@angular/core';

interface Activity {
  id: number;
  type: 'client' | 'product' | 'quote' | 'prospect';
  title: string;
  description: string;
  timestamp: Date;
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  currentDate: Date = new Date();
  
  // Placeholder counts - these would come from actual services
  clientCount: number = 24;
  productCount: number = 156;
  quoteCount: number = 18;
  prospectCount: number = 42;
  
  // Placeholder recent activities - these would come from an actual service
  recentActivities: Activity[] = [
    {
      id: 1,
      type: 'client',
      title: 'Nouveau client ajouté',
      description: 'Société ABC a été ajoutée comme nouveau client',
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1))
    },
    {
      id: 2,
      type: 'quote',
      title: 'Devis créé',
      description: 'Devis #QT-2023-042 créé pour Société XYZ',
      timestamp: new Date(new Date().setHours(new Date().getHours() - 3))
    },
    {
      id: 3,
      type: 'product',
      title: 'Produit mis à jour',
      description: 'Stock du produit "Carton 30x20" mis à jour',
      timestamp: new Date(new Date().setHours(new Date().getHours() - 5))
    },
    {
      id: 4,
      type: 'prospect',
      title: 'Prospect contacté',
      description: 'Suivi effectué avec le prospect Entreprise 123',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1))
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // In a real application, you would fetch data from services here
    // this.loadDashboardData();
  }

  getActivityIcon(type: string): string {
    switch(type) {
      case 'client': return 'people';
      case 'product': return 'inventory_2';
      case 'quote': return 'description';
      case 'prospect': return 'person_add';
      default: return 'event_note';
    }
  }

  // This would be implemented to fetch real data
  // private loadDashboardData(): void {
  //   // Fetch counts and recent activities from services
  // }
}
