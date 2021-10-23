import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AudioSongInfo } from "../models/audio-event.model";

@Injectable()
export class ActivityService{
    public _audioActivitySubject = new Subject<{
        song: AudioSongInfo, 
        type: 'play' | 'pause' | 'stop' |'playNext' | 'playPrev', 
        data: any 
    }>();

    public _favoriteToggle = new Subject<{title: string}>();
    
    public _activityObservable = this._audioActivitySubject.asObservable();


    
}