import { Component, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { PlayList, Song } from '../models/song.model';
import { ActivityService } from '../services/activity.service';
import { AudioService } from '../services/audio.service';
import { SongService } from '../services/data/song.service';
import { SongQuery } from '../services/data/songQuery.model';
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

  handleFavorite(fav: {title: string, flag: number}){
    const index= this.songList.findIndex(song => song.title === fav.title);
    const song = index >=0? this.songList[index]: undefined;

    if(fav.flag > 0 && song){
        song.userPref= song.userPref? {...song.userPref, favorite: true}: {favorite: true};
        this.favorites.push(song);
    }else if(song){
      if(song.userPref){
        song.userPref= song.userPref? {...song.userPref, favorite: false}: {favorite: false};
      }
      this.favorites = this.favorites.filter(s => s.title !== fav.title)
    }
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
