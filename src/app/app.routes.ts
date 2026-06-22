import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'app',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'recordatorios',
        loadComponent: () => import('./pages/recordatorios/recordatorios.component').then(m => m.RecordatoriosComponent)
      },
      {
        path: 'recomendaciones',
        loadComponent: () => import('./pages/recomendaciones/recomendaciones.component').then(m => m.RecomendacionesComponent)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
      },
      {
        path: 'partner',
        loadComponent: () => import('./pages/partner/partner.component').then(m => m.PartnerComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
