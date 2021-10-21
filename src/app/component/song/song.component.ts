import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { floor, isNil } from 'lodash';
import { AudioEvent, defaultEvent } from 'src/app/models/audio-event.model';
import { UserPrefService } from 'src/app/services/data/user-pref.service';
import { Duration, UserPreference } from '../../models/song.model';
import { ActivityService } from '../../services/activity.service';
import { AudioService } from '../../services/audio.service';
import { SongService } from '../../services/data/song.service';

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
  @Output() public readonly rmFromPl = new EventEmitter<any>();

  public durationFormatted: string= '00:00:00';
  public isFav= false;
  public image: {data: string} ={data: ""};
  public showPlay: boolean=  false;
  public value = 25;
  public audio : AudioEvent = {...defaultEvent};

  constructor(
    private detector: ChangeDetectorRef,
    private readonly songService: SongService,
    private readonly audioService: AudioService,
    private readonly activityService: ActivityService,
    private readonly userPrefService: UserPrefService
    ) { }



  ngOnInit() {

    if (this.audioService.audioEvent.currentTitle === this.title){
      this.audio = this.audioService.audioEvent;
    }

    if(this.userPrefService.isFavorite(this.title)){
      this.isFav = true;
    }

    this.songService.getImage(this.title, this.image);

    this.activityService._activitySubject.subscribe(activity => {
        switch(activity.type){
          case "favorite":
            if (this.title === activity.id){
              this.isFav = !this.isFav;
            }
            break;
  
          case "play":
            if (this.title === activity.id){
              this.audio = this.audioService.audioEvent;
            }else{
              this.audio = {...defaultEvent};
            }
            break;
  
          default:
  
        }

        this.detector.detectChanges();
    });
  }




  ngOnChanges(changes: SimpleChanges): void {
      
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
    if (this.isFav){
      this.userPrefService.removeFromFav(this.title);
    }else{
      this.userPrefService.addToFav(this.title);
    }
    // this.handleFav.emit({title: this.title, flag: this.isFav? -1: 1});
  }

  public addToPlaylist(plName: string){
    // this.addToList.emit({plName, songName: this.title, add: true});
    this.userPrefService.addToPlayList(plName, this.title);

  }

  public removeFromPlaylist(){
    this.rmFromPl.emit(this.title);
  }

  play(){
    this.userPrefService.addToRecent(this.title);
    this.audioService.play(this.title);
  }

  pause(){
    this.audioService.pause();
  }

  download(){

  }

  hoverOnImg(){
    this.showPlay = true;

  }

  hoverOffImg(){
    this.showPlay = false;
  }

  getPlayedPercentage(){
    if(this.audio.currentTitle !== ''){
      return Math.floor(this.audio.currentPlayPoint* 100 /this.audio.songDuration) + '%';

    }
    return '0%';
  }
}
