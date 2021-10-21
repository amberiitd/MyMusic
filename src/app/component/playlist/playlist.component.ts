import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { isEmpty } from 'lodash';
import { UserPrefService } from 'src/app/services/data/user-pref.service';
import { PlayList } from '../../models/song.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnChanges {

  
  @Input() public playLists: Array<PlayList>=[];  
  public form: {listName: string, formActive: boolean}= {listName: '', formActive: false};
  constructor(
    private readonly userPrefService: UserPrefService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.playLists);
  }

  ngOnInit(): void {
  }

  handleNewPlayList(){
    if(!this.form.formActive){
      this.form.formActive= true;
    }else if(isEmpty(this.form.listName)){
      this.form.formActive= false;
      return;
    }else{
      const index = this.playLists.findIndex((pl) => pl.name=== this.form.listName)
      
      if(index < 0){
          this.userPrefService.createPlayList(this.form.listName);
        // this.addNewPlaylist.emit({name: this.form.listName, songs: [], state: {}});
      }else{
        console.log(`Playlist with name:${this.form.listName}, already exits`);
      }
      this.form.formActive= false;
    }
  }

  toggleDropDown(plName: string){
    const index= this.playLists.findIndex(pl => pl.name===plName)
    this.playLists[index]= {...this.playLists[index], state: {dropDownActive: !this.playLists[index].state.dropDownActive}}
  }

  remove(plName: string, title: string){
    this.userPrefService.removeFromPlayList(plName, title);
  }

  deletePl(plName: string){
    this.userPrefService.deletePlayList(plName);
  }

  addToFavorite(fav: {title: string, flag: number}){
    // this.addToFav.emit(fav);
  }
}
