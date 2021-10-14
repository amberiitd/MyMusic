import { Component, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { PlayList, Song } from '../models/song.model';
import { AudioService } from '../services/audio.service';
import { SongService } from '../services/data/song.service';
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
  public activeTabId: number = 5;
  public playListsNameInput: string[] =[]
  public playHistory: Song[]=[];
  public onPlaySongIndex = -1;

  constructor(
    private readonly songService: SongService,
    private readonly audioService: AudioService,
    private readonly userService: UserService
    ) {
      songService.init();
  }

  ngOnInit(): void {
    this.navTabs =[
      {
        id: 1,
        name: 'songs',
      },
      {
        id: 2,
        name: 'favorites',
      },
      {
        id: 3,
        name: 'playlist'
      },
      {
        id: 4,
        name: 'history'
      },{
        id: 5,
        name: 'player'
      }
    ]

    this.songService.songListSubject.subscribe(
      songList => {this.songList = songList}
    );

    this.songList.forEach(song =>{
      if (song.userPref && song.userPref.favorite){
        this.favorites.push(song);
      }
    })

    this.playlists =[
      {
        name: 'Azra',
        songs: this.songList.slice(0,2),
        state: {dropDownActive: false,}
      },
      {
        name: 'Amber',
        songs: [],
        state: {dropDownActive: false,}
      }
    ];

    this.playListsNameInput = this.playlists.map(pl => pl.name);

    this.audioService.songOnPlay$.subscribe(data =>{
      const index = this.songList.findIndex(s => s.title === data);

      if(this.onPlaySongIndex >= 0){
        this.songList[this.onPlaySongIndex].userPref = {
          ...this.songList[this.onPlaySongIndex].userPref,
          onPlay: false
        };

        this.audioService.pause();
      }
  
      if(index !== this.onPlaySongIndex){
        this.songList[index].userPref = {
          ...this.songList[index].userPref,
          onPlay: true
        };
        this.onPlaySongIndex = index;
        this.audioService.play(data);

        //push to history
        if(isEmpty(this.playHistory) || this.playHistory[0].title !== this.songList[index].title){
          this.playHistory= [this.songList[index], ...this.playHistory.slice(0, 10)];
        }
      }else{
        this.onPlaySongIndex = -1;
      }
    });


  }

  refresh(tabId: number){
    if (tabId === 1){
      this.songService.refresh();
    }
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

  addNewPlaylist(pl: PlayList){
    this.playlists.push(pl);
    this.playListsNameInput = this.playlists.map(pl => pl.name);
  }

  addToPlayList(param: {plName: string, songName: string, add: boolean}){
    const plIndex= this.playlists.findIndex(pl => pl.name=== param.plName) ;
    const songIndex= this.songList.findIndex(s => s.title === param.songName);
    if(plIndex >= 0 && songIndex >=0 ){
      const index = this.playlists[plIndex].songs.findIndex(s => s.title=== param.songName);
      if(index < 0 && param.add){
        this.playlists[plIndex].songs.push(this.songList[songIndex]);
      }else if(index >= 0 && !param.add){
        this.playlists[plIndex].songs.splice(index, 1);
      }
    }
  }

}
