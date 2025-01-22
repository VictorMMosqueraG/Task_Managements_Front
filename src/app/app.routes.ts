import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'home',
    loadComponent: ()=> import('./components/home/home.component'),
  },
  {
    path: '',
    redirectTo:'/home',
    pathMatch:'full'
  },
  {
    path:'register',
    loadComponent: ()=> import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path:"login",
    loadComponent: ()=> import('./components/login/login.component').then(m => m.LoginComponent)
  }
];
