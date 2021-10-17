import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./component/login/login.component";
import { AuthGuard } from "./config/auth.guard";
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
