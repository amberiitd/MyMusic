import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ActivityService{
    public _activitySubject = new Subject<{
        id: string, 
        type: 'favorite' | 'play' | 'song' | 'user-pref', 
        data: any 
    }>();
    
    public _activityObservable = this._activitySubject.asObservable();

    public _playlistUpdate = new Subject();
    public _favListUpdate = new Subject();
    public _playHistoryUpdate = new Subject();

    
}