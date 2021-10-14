import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { floor, isNil } from 'lodash';
import { Duration, Song, UserPreference } from '../../models/song.model';
import { AudioService } from '../../services/audio.service';
import { SongService } from '../../services/data/song.service';
import { DisplayService } from '../../services/display.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit, OnChanges {

  @Input() public title: string;
  @Input() public singer: string;
  @Input() public album: string;
  @Input() public duration: Duration;
  @Input() public userPref: UserPreference={};
  @Input() public playLists: ReadonlyArray<string>=[];
  @Input() public viewOptions: any= {favorite: true, playlist: true};
  @Output() public readonly handleFav= new EventEmitter<any>();
  @Output() public readonly addToList= new EventEmitter<any>();

  public durationFormatted: string= '00:00:00';
  public isOnPlay = false;
  public isFav= false;
  public audioFile: Blob;

  constructor(
    private detector: ChangeDetectorRef,
    private readonly songService: SongService,
    private readonly audioService: AudioService,
    private readonly displayService: DisplayService,
    ) { }



  ngOnInit() {

    if (this.audioService.currentTitle === this.title){
      this.isOnPlay = !this.audioService.isOnPause;
    }

    this.displayService._activitySubject.subscribe(activity => {
        switch(activity.type){
          case "favorite":
            if (this.title === activity.id){
              this.isFav = !this.isFav;
            }
            break;
  
          case "play":
            if (this.title === activity.id){
              this.isOnPlay = activity.data;
            }else if (this.isOnPlay){
              this.isOnPlay = false;
            }
            break;
  
          default:
  
        }

        this.detector.detectChanges();
    });
        
  }




  ngOnChanges(changes: SimpleChanges): void {
      if(this.hasBindingChanged(changes, 'duration')){
        this.durationFormatted = this.formatDuration(this.duration);
      }

      if(this.hasBindingChanged(changes, 'userPref')){
        this.isFav= this.userPref.favorite != undefined? this.userPref.favorite: this.isFav;
        this.isOnPlay =  this.userPref.onPlay != undefined? this.userPref.onPlay: this.isOnPlay;
      }
      
  }

  private formatDuration(duration: Duration): string {
    let _sec = `${duration?.sec % 60}`;
    let _min = `${(duration?.min + floor(duration?.sec/60)) % 60}`;
    let _hour = `${duration?.hour + floor((duration?.min + floor(duration?.sec/60)) / 60)}`;
    
    _sec = _sec.length === 1? `0${_sec}`: _sec;
    _min = _min.length === 1? `0${_min}`: _min;
    _hour = _hour.length === 1? `0${_hour}`: _hour;

    return _hour+ ':'+ _min+ ':' + _sec;
  }

  private hasBindingChanged(changes: SimpleChanges, input: string){
    return !isNil(changes[input]);
  }

  public heart(){
      this.handleFav.emit({title: this.title, flag: this.isFav? -1: 1});
  }

  public addToPlaylist(plName: string){
    this.addToList.emit({plName, songName: this.title, add: true});
  }

  play(){
    this.audioService.play(this.title);
  }

  pause(){
    this.audioService.pause();
  }

  download(){

  }

}
