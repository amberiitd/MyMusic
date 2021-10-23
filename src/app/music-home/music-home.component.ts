import { Component, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { PlayList, Song } from '../models/song.model';
import { ActivityService } from '../services/activity.service';
import { AudioService } from '../services/audio.service';
import { SongService } from '../services/data/song.service';
import { SongQuery } from '../models/songQuery.model';
import { UserPrefService } from '../services/data/user-pref.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-music-home',
  templateUrl: './music-home.component.html',
  styleUrls: ['./music-home.component.css']
})
export class MusicHomeComponent implements OnInit {

  public songList: ReadonlyArray<Song>= [];
  public favorites: Song[]= [];
  public playlists: PlayList[]=[];
  public navTabs: any[];
  public activeTabId: number = 1;
  public playListsNameInput: string[] =[]
  public playHistory: Song[]=[];
  public searchList: Song[] =[];
  public onPlaySongIndex = -1;
  public searchString ='';

  constructor(
    private readonly songService: SongService,
    private readonly userPrefService: UserPrefService,
    ) {}    
  

  ngOnInit(): void {
    this.navTabs =[
      {
        id: 1,
        name: 'songs',
      },
      {
        id: 3,
        name: 'playlist'
      }
    ]
    this.songService.init();
    this.userPrefService.init();

    this.songList = this.songService.localSongRepo;
    this.favorites = this.userPrefService.favList;
    this.playHistory = this.userPrefService.recents;
    this.playlists = this.userPrefService.playLists;
    this.playListsNameInput = this.userPrefService.playListNames;

  }

  refresh(tabId: number){
    
  }

  searchSong(){
    if(this.searchString.length < 3){
      return;
    }
    const query: SongQuery = {
      title: this.searchString
    }
    this.searchList = [];
    this.songService.fetchSongs(this.searchList, query);
  }

  deleteCategory(cat: string){
    if(cat === "Search Results"){
      this.searchList =[];
    }
  }

}
