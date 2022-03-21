import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class ShopGuard implements CanActivate {

  constructor(private sessionService:SessionService,private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //Users shouldn't be able to access products and shop page if they are not logged in.
      return (this.sessionService.isLoggedIn()) ? true : this.router.parseUrl('/login') ;
  }
  
}
