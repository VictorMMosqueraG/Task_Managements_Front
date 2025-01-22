import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task/task-list/task-list.component';

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
  },
  {
    path:'task-list',
    loadComponent: ()=> import('./components/task/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path:'task-create',
    loadComponent: ()=> import('./components/task/task-create/task-create.component').then(m => m.TaskCreateComponent)
  }
];
