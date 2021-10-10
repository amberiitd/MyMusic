import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate{
    constructor(
        private userService: UserService,
        private router: Router
    ){}
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(this.router.url === "/login" || this.userService.context.isAuthenticated){
            return true;
        }

        this.router.navigate(["/login"]);
        return false;
    }

}