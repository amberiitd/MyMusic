import { Component, Input, OnInit, Output } from '@angular/core';
import { Song } from 'src/app/models/song.model';

@Component({
  selector: 'app-category-board',
  templateUrl: './category-board.component.html',
  styleUrls: ['./category-board.component.css']
})
export class CategoryBoardComponent implements OnInit {

  @Input()
  public name: string = "General";

  @Input()
  public playListNames: ReadonlyArray<string> = [];

  @Input()
  public songList: ReadonlyArray<Song> = [];

  constructor() { }

  ngOnInit(): void {
  }

  dummy(event: any){

  }

}
