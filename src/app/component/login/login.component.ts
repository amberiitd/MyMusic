import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: {username: any , password: any } ={username: "", password: ""};
  public loginStatus: "success" | "error" | "loading" | "blank" = "blank";
  public errorMsg: string = "";

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginStatus = this.userService.context.isAuthenticated ? "success": "blank";
    this.userService.refreshAuth.subscribe(() =>{
      if (this.userService.context.isAuthenticated ){
        this.loginStatus = "success"
      }else{
        this.loginStatus = "error";
        this.errorMsg = "Could not Authorize!"
      }
    });
  }

  login(){
    this.loginStatus = "loading";

    if (!isEmpty(this.form.username.trim()) && !isEmpty(this.form.password.trim())){
      this.userService.authenticate(this.form.username, this.form.password);
    }else{
      this.loginStatus = "error";
      this.errorMsg = "Empty or wrong input!"
    }
  }

  navigate(relPath: string){
    this.router.navigate(["/home"]);
  }

}
