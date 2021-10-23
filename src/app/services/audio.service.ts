import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AudioEvent, AudioSongInfo, defaultEvent } from "../models/audio-event.model";
import { formatTime } from "../util/func";
import { ActivityService } from "./activity.service";
import { SongService } from "./data/song.service";

@Injectable({
    providedIn: "root"
})
export class AudioService{
    public _songOnPlay= new Subject<string>();
    public songOnPlay$ = this._songOnPlay.asObservable();

    public audioEvent: AudioEvent = {...defaultEvent};
    
    private timerObject: any;
    private creatingSource= false;
    private lastPlayPoint: number = 0;

    // audio context
    private audioFile: Blob;
    private audioCtx: AudioContext;
    private audioSrc: AudioBufferSourceNode;
    private audioBuffer: AudioBuffer | null;
    private playRequest: AudioSongInfo | null;


    constructor(
        private songService: SongService,
        private displayService: ActivityService
    ){ }

    play(song: AudioSongInfo, offset: number | null = null){

        if(song.title === this.audioEvent.currentSongInfo.title){
            if (offset && offset >=0 ){
                this.audioEvent.currentPlayPoint = offset;
            }
            this.startPlayer();

            return;
        }

        if(this.audioSrc){
            this.pause();
            // this.audioSrc.disconnect();
        }
       
        this.lastPlayPoint = 0;
        this.audioEvent.currentPlayPoint = 0;
        this.playRequest =song;
        this.buildAudioCtx(song);
   
    }

    async pause(){
        if(this.audioEvent.isOnPause){
            return;
        }
        this.displayService._audioActivitySubject.next({song: this.audioEvent.currentSongInfo, type: 'pause', data: false});
        this.audioEvent.isOnPause = true;
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

        if(!this.audioEvent.isOnPause){
            await this.audioSrc.stop();
        }

        this.audioEvent.songDuration = this.audioBuffer? this.audioBuffer.duration: 0;
        this.displayService._audioActivitySubject.next({song: this.audioEvent.currentSongInfo, type: 'play', data: true});

        this.audioSrc = this.audioCtx.createBufferSource();
        this.audioSrc.connect(this.audioCtx.destination);
        this.audioSrc.buffer = this.audioBuffer;
        
        await clearTimeout(this.timerObject);
        setTimeout(() => {
            if (!this.audioEvent.isOnPause){
                this.timer(200);
            }
        }, 200);
        this.lastPlayPoint = this.audioCtx.currentTime;
        this.audioSrc.start(0, this.audioEvent.currentPlayPoint);
        this.audioEvent.isOnPause = false;

        this.creatingSource = false;

    }

    private async buildAudioCtx(song: AudioSongInfo){
        var songBlob ={data: new Blob()};
        this.songService.fetchSongBlob(song.title, songBlob).subscribe(
            async res => {
                this.audioEvent.currentSongInfo = song;
                this.audioFile = res;
                
                this.audioCtx = new AudioContext();
                this.audioBuffer = null;
        
                var arrayBuffer = await this.audioFile.arrayBuffer();
            
                await this.audioCtx.decodeAudioData(arrayBuffer, (data) => {
                    this.audioBuffer = data;
                });
                
                if(this.playRequest && this.playRequest.title){
                    this.play(this.playRequest);
                    this.playRequest = null;
                }
            }
        )
   
    }

    private timer(ms: number){
        this.timerObject = setTimeout(()=>{
          // do something
          this.audioEvent.currentPlayPoint+= ms/1000;
          if (this.audioEvent.currentPlayPoint > this.audioEvent.songDuration){
            this.onEnded();
          }
          if (!this.audioEvent.isOnPause){
            this.timer(ms);
          }
        }, ms)
    }

    private onEnded(){
        this.lastPlayPoint = 0;
        this.audioEvent.currentPlayPoint = 0;
        this.audioEvent.isOnPause = true;
        this.displayService._audioActivitySubject.next({song: this.audioEvent.currentSongInfo, type: 'stop', data: false});
    }

}