import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AudioService{
    _songOnPlay= new Subject<string>();
    songOnPlay$ = this._songOnPlay.asObservable();

}