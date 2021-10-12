import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class DisplayService{
    public _activitySubject = new Subject<{
        id: string, 
        type: 'favorite' | 'play', 
        data: any 
    }>()
    
    public _activityObservable = this._activitySubject.asObservable();
}