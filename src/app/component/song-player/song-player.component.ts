import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { Song } from 'src/app/models/song.model';
import { AudioService } from 'src/app/services/audio.service';
import { SongService } from 'src/app/services/data/song.service';
import { DisplayService } from 'src/app/services/display.service';
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
    private readonly displayService: DisplayService,
    private readonly songService: SongService,
    private readonly detector: ChangeDetectorRef
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
    if (this.isPlaying && this.timerStopped){
      this.timer(200);
      this.timerStopped = false;
    }

    this.displayService._activitySubject.subscribe(activity => {
      if(activity.type === 'play'){

        if( !this.songOnPlay || this.songOnPlay!= activity.id){
          this.songOnPlay = activity.id
          this.duration = this.audioService.songDuration;
          this.durationString = formatTime(this.duration);
          this.isSliderDisabled = false;
        }
        
        this.isPlaying = activity.data;
        this.currentTime = this.audioService.currentPlayPoint;

        setTimeout(() => {
          if (this.isPlaying && this.timerStopped){
              this.timer(200);
              this.timerStopped = false;
          }
        }, 200);
      }

      // this.detector.detectChanges();
    });

 

  }

  handleSlide(event: MatSliderChange){
    this.currentTime = event.value?? this.currentTime;
  }

  handleChange(event: MatSliderChange){
    this.audioService.play(this.songOnPlay, event.value);
  }

  play(){
    this.audioService.play(this.songOnPlay)
  }

  pause(){
    this.audioService.pause();
  }

  playPrev(){
    var dummy = false;
  }

  timer(ms: number){
    setTimeout(()=>{
      // do something
      this.currentTime+= (ms/1000);
      if (this.isPlaying){
        this.timer(ms);
      }else{
        this.timerStopped = true;
      }
      }, ms)
  }

}
