import { HttpClient } from "@angular/common/http";
import { tokenize } from "@angular/compiler/src/ml_parser/lexer";
import { Injectable } from "@angular/core";
import { of, Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthTokenEndpointResponse } from "../models/auth.model";

@Injectable()
export class UserService{

    public context: {
        username: string | undefined;
        isAuthenticated: boolean;
        token: string | undefined;
    };

    public refreshAuth = new Subject();

    public constructor(private httpClient: HttpClient){
        const token = sessionStorage.getItem("oauth-token");
        if(token){
            this.context = { username: undefined, isAuthenticated: true, token: token};
        }else{
            this.context = {
                username: undefined,
                isAuthenticated: false,
                token: undefined
            };
        }
        this.refreshAuth.next();
    }

    public async authenticate(username: string, password: string){

        const body = new FormData();
        body.append("grant_type", "password");
        body.append("username", username);
        body.append("password", password);

        const body2 = {}

        console.log(body.get("grant_type"));

        const options = {
            headers: {
                "Authorization": "Basic bXltdXNpYy1jbGllbnQ6c2VjcmV0"
            }
        };
        await this.httpClient.post<AuthTokenEndpointResponse>("http://localhost:8090/oauth/token", body, options)
        .pipe(
            catchError((error: any) =>{
                console.log(error);
                return throwError(error);
            })
        )
        .subscribe(response => { 
            console.log(response.access_token);
            sessionStorage.setItem("oauth-token", response.access_token);
            this.context.token = response.access_token;
            this.context.isAuthenticated = true;
            this.refreshAuth.next();
        });

        return this.context.isAuthenticated;

    }

    public getOAuthToken(){
        return this.context.token;
    }
}