import { AfterContentChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Song } from 'src/app/models/song.model';

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

  constructor() { }

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

}
