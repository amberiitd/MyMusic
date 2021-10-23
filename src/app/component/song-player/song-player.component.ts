import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { AudioEvent, defaultEvent } from 'src/app/models/audio-event.model';
import { ActivityService } from 'src/app/services/activity.service';
import { AudioService } from 'src/app/services/audio.service';
import { UserPrefService } from 'src/app/services/data/user-pref.service';
import { formatTime } from 'src/app/util/func';

@Component({
  selector: 'app-song-player',
  templateUrl: './song-player.component.html',
  styleUrls: ['./song-player.component.css']
})
export class SongPlayerComponent implements OnInit{

  public audio: AudioEvent = {...defaultEvent};
  public durationString: string ="00.00";
  private timerStopped = true;
  public formatTime = formatTime;

  constructor(
    public readonly audioService: AudioService,
    private readonly activityService: ActivityService,
    private readonly detector: ChangeDetectorRef,
    private readonly userPrefService: UserPrefService
  ) { 

  }

  ngOnInit(): void {
    
    this.audio = this.audioService.audioEvent;

    // this.activityService._activitySubject.subscribe(activity => {
    //   if(activity.type === 'play'){

    //     if( !this.songOnPlay || this.songOnPlay!= activity.id){
    //       this.songOnPlay = activity.id
    //       this.duration = this.audioService.songDuration;
    //       this.durationString = ;
    //       this.isSliderDisabled = false;
    //     }
    //   }
    // });
  }

  handleSlide(event: MatSliderChange){
    this.audio.currentPlayPoint = event.value?? this.audio.currentPlayPoint;
  }

  handleChange(event: MatSliderChange){
    this.audioService.play(this.audio.currentSongInfo, event.value);
  }

  play(){
    this.audioService.play(this.audio.currentSongInfo);
  }

  pause(){
    this.audioService.pause();
  }

  playPrev(){
    this.audioService.pause();
    this.activityService._audioActivitySubject.next({song: this.audio.currentSongInfo, type: 'playPrev', data: null});
  }

  playNext(){
    this.audioService.pause();
    this.activityService._audioActivitySubject.next({song: this.audio.currentSongInfo, type: 'playNext', data: null});
  }

  loop(){
    this.audio.loop = !this.audio.loop;
    this.audio.shuffle = false;
  }

  shuffle(){
    this.audio.loop = false;
    this.audio.shuffle = !this.audio.shuffle;
  }


}
