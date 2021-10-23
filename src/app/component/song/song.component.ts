import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { floor, isNil } from 'lodash';
import { Subscription } from 'rxjs';
import { AudioEvent, defaultEvent } from 'src/app/models/audio-event.model';
import { UserPrefService } from 'src/app/services/data/user-pref.service';
import { Duration, Song } from '../../models/song.model';
import { ActivityService } from '../../services/activity.service';
import { AudioService } from '../../services/audio.service';
import { SongService } from '../../services/data/song.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit, OnChanges {

  @Input() public category: string;
  @Input() public song: Song;
  @Input() public playLists: ReadonlyArray<string>=[];
  @Input() public viewOptions: any= {favorite: true, playlist: true};
  @Output() public readonly rmFromPl = new EventEmitter<any>();
  @Output() public readonly toParent = new EventEmitter<{title: string, type: 'next' |'prev' | 'random'}>();

  public isFav= false;
  public image: {data: string} ={data: ""};
  public showPlay: boolean=  false;
  public audio : AudioEvent = {...defaultEvent};
  private activitySubscription: Subscription;

  constructor(
    private detector: ChangeDetectorRef,
    private readonly songService: SongService,
    private readonly audioService: AudioService,
    private readonly activityService: ActivityService,
    private readonly userPrefService: UserPrefService
    ) { }

  ngOnInit() {

    if (this.audioService.audioEvent.currentSongInfo.title === this.song.title){
      this.audio = this.audioService.audioEvent;
    }

    if(this.userPrefService.isFavorite(this.song.title)){
      this.isFav = true;
    }

    this.songService.getImage(this.song.title, this.image);
    this.subscribeToActivity();
        
  }

  ngOnChanges(changes: SimpleChanges): void {
    
      
  }

  public heart(){
    if (this.isFav){
      this.userPrefService.removeFromFav(this.song.title);
    }else{
      this.userPrefService.addToFav(this.song.title);
    }

  }

  public addToPlaylist(plName: string){
    // this.addToList.emit({plName, songName: this.song.title, add: true});
    this.userPrefService.addToPlayList(plName, this.song.title);

  }

  public removeFromPlaylist(){
    this.rmFromPl.emit(this.song.title);
  }

  play(){
    if(this.audio.currentSongInfo.title !== this.song.title){
      this.userPrefService.addToRecent(this.song.title);
        this.audioService.play({title: this.song.title, category: this.category});
    }else{
      this.resume()
    }
  }

  pause(){
    this.audioService.pause();
  }

  resume(){
    this.audioService.play(this.audio.currentSongInfo);
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
    if(this.audio.currentSongInfo.title !== ''){
      return Math.floor(this.audio.currentPlayPoint* 100 /this.audio.songDuration) + '%';

    }
    return '0%';
  }

  private subscribeToActivity(){
    this.activitySubscription= this.activityService._audioActivitySubject.subscribe( activity =>{
      switch(activity.type){
        case "play":
          if (this.song.title === activity.song.title){
            this.audio = this.audioService.audioEvent;
          }else{
            this.audio = {...defaultEvent};
          }
          break;

        case "pause":
          
          break;
        
        case "stop":
          if (this.song.title === activity.song.title && this.category === activity.song.category){
            this.audio = {...defaultEvent};
            if(this.audioService.audioEvent.loop){
              this.toParent.emit({title: this.song.title, type: 'next'});
            }else if(this.audioService.audioEvent.shuffle){
              this.toParent.emit({title: this.song.title, type: 'random'});
            }
            
          }
          break;

        case "playNext":
          if (this.song.title === activity.song.title && this.category === activity.song.category){
            this.audio = {...defaultEvent};
            this.toParent.emit({title: this.song.title, type: 'next'});
          }
          break;
        
        case "playPrev":
          if (this.song.title === activity.song.title && this.category === activity.song.category){
            this.audio = {...defaultEvent};
            this.toParent.emit({title: this.song.title, type: 'prev'});
          }
          break;

        default:

      }
    });

    this.activityService._favoriteToggle.subscribe(
      event =>{
        if(this.song.title === event.title){
          this.isFav = !this.isFav;
        }
      }
    )
  }

  private hasBindingChanged(changes: SimpleChanges, input: string){
    return !isNil(changes[input]);
  }
}
