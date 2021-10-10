import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./config/auth.guard";
import { LoginComponent } from "./login/login.component";
import { MusicHomeComponent } from "./music-home/music-home.component";

const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "home",
        component: MusicHomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "**",
        redirectTo: "/login"
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}
