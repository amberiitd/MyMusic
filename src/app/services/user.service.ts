import { HttpClient } from "@angular/common/http";
import { tokenize } from "@angular/compiler/src/ml_parser/lexer";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthTokenEndpointResponse } from "../models/auth.model";

@Injectable()
export class UserService{

    public context: {
        username: string | undefined;
        isAuthenticated: boolean;
        token: string | undefined;
    } = {
        username: undefined,
        isAuthenticated: false,
        token: undefined
    }

    public constructor(private httpClient: HttpClient){
        const token = localStorage.getItem("oauth-token");
        if(token){
            this.context = { username: undefined, isAuthenticated: true, token: token}
        }
    }

    public authenticate(username: string, password: string){

        if (this.context.isAuthenticated){
            return;
        }
        const body = new FormData();
        body.append("grant_type", "password");
        body.append("username", "namber");
        body.append("password", "amber1940");

        const body2 = {}

        console.log(body.get("grant_type"));

        const options = {
            headers: {
                "Authorization": "Basic bXltdXNpYy1jbGllbnQ6c2VjcmV0"
            }
        };
        this.httpClient.post<AuthTokenEndpointResponse>("http://localhost:8090/oauth/token", body, options)
        .pipe(
            catchError((error: any) =>{
                console.log(error);
                return throwError(error);
            })
        )
        .subscribe(response => { 
            
            console.log(response.access_token);
            localStorage.setItem("oauth-token", response.access_token);
            this.context.token = response.access_token;
            this.context.isAuthenticated = true;
        });

        return true;

    }

    public getOAuthToken(){
        return this.context.token;
    }
}