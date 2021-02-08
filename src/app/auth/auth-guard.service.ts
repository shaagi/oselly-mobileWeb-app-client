import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // alert(`Checking if Authenticated: ${this.authService.isAuthenticated()}`);
    const isAuthenticated = this.authService.isAuthenticated();
    // if (!isAuthenticated) {
    //   this.router.navigate(['loginReg']);
    // }
    return isAuthenticated;
  }
}
