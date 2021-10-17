import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ActivityService } from "./activity.service";
import { SongService } from "./data/song.service";

@Injectable({
    providedIn: "root"
})
export class AudioService{
    public _songOnPlay= new Subject<string>();
    public songOnPlay$ = this._songOnPlay.asObservable();

    public currentPlayPoint: number = 0;
    public songDuration: number =0;
    public currentTitle : string;
    public isOnPause = true;
    
    private timerObject: any;
    private creatingSource= false;
    private lastPlayPoint: number = 0;

    // audio context
    private audioFile: Blob;
    private audioCtx: AudioContext;
    private audioSrc: AudioBufferSourceNode;
    private audioBuffer: AudioBuffer | null;
    private playRequest: {title: string | null} ={title: null};


    constructor(
        private songService: SongService,
        private displayService: ActivityService
    ){

        this.songService.songAudio.subscribe(async song => {
            this.currentTitle = song.title;
            this.audioFile = song.data;
            
            this.audioCtx = new AudioContext();
            this.audioBuffer = null;

            var arrayBuffer = await this.audioFile.arrayBuffer();
      
            await this.audioCtx.decodeAudioData(arrayBuffer, (data) => {
              this.audioBuffer = data;
            });
            
            if(this.playRequest.title){
                this.play(this.playRequest.title);
                this.playRequest = {title: null};
            }
          });
    }

    play(title: string, offset: number | null = null){

        if(title === this.currentTitle){
            if (offset && offset >=0 ){
                this.currentPlayPoint = offset;
            }
            this.startPlayer();

            return;
        }

        if(this.audioSrc){
            this.pause();
            // this.audioSrc.disconnect();
        }
       
        this.lastPlayPoint = 0;
        this.currentPlayPoint = 0;
        this.playRequest ={title: title};
        this.songService.fetchSong(title);
   
    }

    async pause(){
        if(this.isOnPause){
            return;
        }
        this.displayService._activitySubject.next({id: this.currentTitle, type: 'play', data: false});
        this.isOnPause = true;
        await this.audioSrc.stop();
    }

    stop(){
        this.audioSrc.stop();
    }

    async startPlayer(){
        if (this.creatingSource){
            console.log("WARNING: only one source is allowed to create at once!")
            return;
        }
        this.creatingSource = true;

        if(!this.isOnPause){
            await this.audioSrc.stop();
        }

        this.songDuration = this.audioBuffer? this.audioBuffer.duration: 0;
        this.displayService._activitySubject.next({id: this.currentTitle, type: 'play', data: true});

        this.audioSrc = this.audioCtx.createBufferSource();
        this.audioSrc.connect(this.audioCtx.destination);
        this.audioSrc.buffer = this.audioBuffer;
        
        await clearTimeout(this.timerObject);
        setTimeout(() => {
            if (!this.isOnPause){
                this.timer(200);
            }
        }, 200);
        this.lastPlayPoint = this.audioCtx.currentTime;
        this.audioSrc.start(0, this.currentPlayPoint);
        this.isOnPause = false;

        this.creatingSource = false;

    }

    private timer(ms: number){
        this.timerObject = setTimeout(()=>{
          // do something
          this.currentPlayPoint+= ms/1000;
          if (this.currentPlayPoint > this.songDuration){
            this.onEnded();
          }
          if (!this.isOnPause){
            this.timer(ms);
          }
        }, ms)
    }

    private onEnded(){
        this.lastPlayPoint = 0;
        this.currentPlayPoint = 0;
        this.isOnPause = true;
        this.displayService._activitySubject.next({id: this.currentTitle, type: 'play', data: false});
    }

}