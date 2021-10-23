import { AfterContentChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Song } from 'src/app/models/song.model';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-category-board',
  templateUrl: './category-board.component.html',
  styleUrls: ['./category-board.component.css']
})
export class CategoryBoardComponent implements OnInit, AfterContentChecked {

  @Input()
  public name: string = "General";

  @Input()
  public playListNames: ReadonlyArray<string> = [];

  @Input()
  public songList: ReadonlyArray<Song> = [];

  @Input()
  public viewOptions: {showCancel: boolean} = {showCancel: false};

  @Output()
  public readonly rmView= new EventEmitter();

  public startIndex = 0;
  public canMoveLeft: boolean;
  public canMoveRight: boolean;

  constructor(
    private readonly audioService: AudioService
  ) { }

  ngOnInit(): void {
    this.canMoveLeft = false;
  }

  ngAfterContentChecked(): void {
    this.canMoveRight = this.songList.length- this.startIndex > 4;
  }

  dummy(event: any){
    this.songList.slice
  }

  cancelView(){
    this.rmView.emit(this.name);
  }

  moveStartIndex(moveBy: number){
    this.startIndex+= moveBy;

    if (this.startIndex === 0){
      this.canMoveLeft = false;
    }else{
      this.canMoveLeft = true;
    }

    if (this.songList.length - this.startIndex <= 4){
      this.canMoveRight = false;
    }else{
      this.canMoveRight = true;
    }


  }

  audioActions(event: {title: string, type: 'next' | 'random' | 'prev'}){
    if(this.name === 'Recent'){
      return;
    }
    const index = this.songList.findIndex(s => s.title === event.title);
    if(event.type === 'next'){
      this.playNext(index+1);
    }else if(event.type === 'random'){
      const randNum = Math.floor(this.songList.length*Math.random());
      if(index === randNum){
        this.playNext(randNum+1);
      }else{
        this.playNext(randNum);
      }
    }else if(event.type === 'prev'){
      this.playNext(index-1);
    }
  }

  private playNext(index: number){
    if (index < 0 || index === this.songList.length){
      index = 0;
    }
    this.audioService.play({title: this.songList[index].title, category: this.name});
  }

}
