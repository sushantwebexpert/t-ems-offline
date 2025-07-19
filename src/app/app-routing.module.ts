import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'voter-add',
    loadChildren: () => import('./pages/voter-add/voter-add.module').then( m => m.VoterAddPageModule)
  },
  {
    path: 'voter-edit/:id',
    loadChildren: () => import('./pages/voter-edit/voter-edit.module').then( m => m.VoterEditPageModule)
  },
  {
    path: 'voter-view/:id',
    loadChildren: () => import('./pages/voter-view/voter-view.module').then( m => m.VoterViewPageModule)
  },
  {
    path: 'upload',
    loadChildren: () => import('./pages/upload/upload.module').then( m => m.UploadPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
