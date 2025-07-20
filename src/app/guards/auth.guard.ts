import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
   
  async canActivate(): Promise<boolean> {
    const isAuth = localStorage.getItem('ems_app_user');
    if (!isAuth) {
      this.router.navigate(['/login']); // Redirect to Login if not authenticated
      return false;
    }
    return true;
  }
}
