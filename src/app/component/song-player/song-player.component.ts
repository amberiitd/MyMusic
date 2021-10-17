import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
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

  public songOnPlay: string;
  public duration: number = 100;
  public currentTime: number = 0;
  public isPlaying = false;
  public durationString: string ="00.00";
  public isSliderDisabled = true;
  private timerStopped = true;

  constructor(
    public readonly audioService: AudioService,
    private readonly activityService: ActivityService,
    private readonly detector: ChangeDetectorRef,
    private readonly userPrefService: UserPrefService
  ) { 

  }

  ngOnInit(): void {
    
    this.songOnPlay = this.audioService.currentTitle;
    this.isPlaying = !this.audioService.isOnPause;
    this.duration = this.audioService.songDuration;
    this.durationString = formatTime(this.duration);
    this.currentTime = this.audioService.currentPlayPoint;
    if(this.songOnPlay){
      this.isSliderDisabled = false;
    }

    this.activityService._activitySubject.subscribe(activity => {
      if(activity.type === 'play'){

        if( !this.songOnPlay || this.songOnPlay!= activity.id){
          this.songOnPlay = activity.id
          this.duration = this.audioService.songDuration;
          this.durationString = formatTime(this.duration);
          this.isSliderDisabled = false;
        }
        
        this.isPlaying = activity.data;
        this.currentTime = this.audioService.currentPlayPoint;
      }
    });

 

  }

  handleSlide(event: MatSliderChange){
    this.currentTime = event.value?? this.currentTime;
  }

  handleChange(event: MatSliderChange){
    this.audioService.play(this.songOnPlay, event.value);
  }

  play(){
    this.audioService.play(this.songOnPlay);
  }

  pause(){
    this.audioService.pause();
  }

  playPrev(){

  }
}
