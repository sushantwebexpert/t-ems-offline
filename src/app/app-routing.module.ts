import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'voter-add',
    loadChildren: () => import('./pages/voter-add/voter-add.module').then( m => m.VoterAddPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'voter-edit/:id',
    loadChildren: () => import('./pages/voter-edit/voter-edit.module').then( m => m.VoterEditPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'voter-view/:id',
    loadChildren: () => import('./pages/voter-view/voter-view.module').then( m => m.VoterViewPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'upload',
    loadChildren: () => import('./pages/upload/upload.module').then( m => m.UploadPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
