import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { SongService } from "./data/song.service";
import { DisplayService } from "./display.service";

@Injectable({
    providedIn: "root"
})
export class AudioService{
    _songOnPlay= new Subject<string>();
    songOnPlay$ = this._songOnPlay.asObservable();

    private currentTitle : string;
    private curentPlayPoint: number = 0;
    private lastPlayPoint: number = 0;
    private audioFile: Blob;
    private audioCtx: AudioContext;
    private audioSrc: AudioBufferSourceNode;
    private audioBuffer: AudioBuffer | null;
    private playRequest: {title: string | null} ={title: null};
    private isOnPause = true;


    constructor(
        private songService: SongService,
        private displayService: DisplayService
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

    play(title: string){

        if(title === this.currentTitle){

            
            this.audioSrc = this.audioCtx.createBufferSource();
            this.audioSrc.connect(this.audioCtx.destination);
            this.audioSrc.buffer = this.audioBuffer;
            

            this.lastPlayPoint = this.audioCtx.currentTime;
            this.audioSrc.start(0, this.curentPlayPoint);
            this.isOnPause = false;
            this.audioSrc.onended =()=> {
                if (!this.isOnPause){
                    this.lastPlayPoint = 0;
                    this.curentPlayPoint = 0;
                    this.isOnPause = true;
                    this.displayService._activitySubject.next({id: this.currentTitle, type: 'play', data: null});

                }
            };

            return;
        }

        if(this.audioSrc){
            this.pause();
            this.audioSrc.disconnect();
        }
       
        this.lastPlayPoint = 0;
        this.curentPlayPoint = 0;
        this.playRequest ={title: title};
        this.songService.fetchSong(title);
   
    }

    pause(){
        if(this.isOnPause){
            return;
        }
        this.curentPlayPoint += this.audioCtx.currentTime - this.lastPlayPoint;
        this.isOnPause = true;
        this.audioSrc.stop();
    }

    stop(){
        this.audioSrc.stop();
    }

}