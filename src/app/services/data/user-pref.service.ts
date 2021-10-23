import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PlayList, PlayListDTO, Song } from "src/app/models/song.model";
import { ActivityService } from "../activity.service";
import { UserService } from "../user.service";
import { SongService } from "./song.service";
import { SongQuery } from "../../models/songQuery.model";

@Injectable()
export class UserPrefService{
    
    public user: {username: string, auth: [string]};
    private mymApi = "http://localhost:8080";
    public favList: Song[] = [];
    public recents: Song[] = [];
    public playLists : PlayList[] =[];
    public playListNames: Array<string> =[];

    public constructor(
        private readonly httpClient: HttpClient,
        private readonly userService: UserService,
        private readonly songService: SongService,
        private readonly activityService: ActivityService
    ){ }

    public init(){
        this.getFavSongs();
        this.getPlayLists();
        this.getRecentlyPlayedSongs();
    }

    public isFavorite(title: string) {
        return this.favList.findIndex(song => song.title === title) >=0;
    }

    public addToFav(title: string){
        this.activityService._favoriteToggle.next({title: title});
        this.favList.push(this.songService.getSong(title));

        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            },
            params: new HttpParams().append("title", title)
        };
        this.httpClient.get(this.mymApi + "/user-pref/add-to-fav", options)
        .subscribe(
            res => {
                console.log(res);
            }
        );

    }

    public removeFromFav(title: string){
        this.activityService._favoriteToggle.next({title: title});
        const index = this.favList.findIndex(song => song.title === title);
        this.favList.splice(index, 1);

        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            },
            params: new HttpParams().append("title", title)
        };
        this.httpClient.get(this.mymApi + "/user-pref/remove-from-fav", options)
        .subscribe(
            res => {
                console.log(res);
            }
        );

    }

    public addToPlayList(plName: string, title: string){

        const pl = this.playLists.find(pl => pl.name === plName)
        const index = pl?.songs.findIndex(s => s.title === title);

        if (index && index >=0){
            pl?.songs.push(this.songService.getSong(title));
        }

        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            },
            params: new HttpParams().append("title", title)
                .append("plName", plName)
        };
        this.httpClient.get(this.mymApi + "/user-pref/add-to-playlist", options)
        .subscribe(
            res => {
                console.log(res);
            }
        );
    }

    public removeFromPlayList(plName: string, title: string){

        const pl = this.playLists.find(pl => pl.name === plName);
        const index = pl ? pl.songs.findIndex(songs => songs.title === title): -1;
        if (index >=0 ){
            pl?.songs.splice(index, 1);
        }

        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            },
            params: new HttpParams().append("title", title)
                .append("plName", plName)
        };
        this.httpClient.get(this.mymApi + "/user-pref/remove-from-playlist", options)
        .subscribe(
            res => {
                console.log(res);
            }
        );
    }

    public createPlayList(plName: string){
        this.playLists.push({name: plName, songs: [], state: {}});
        this.playListNames.push(plName);

        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            },
            params: new HttpParams()
                .append("plName", plName)
        };
        this.httpClient.get(this.mymApi + "/user-pref/create-playlist", options)
        .subscribe(
            res => {
                console.log(res);
            }
        );
    }

    public deletePlayList(plName: string){
        const index = this.playLists.findIndex(pl => pl.name === plName);
        this.playLists.splice(index, 1);
        this.playListNames.splice(index, 1);

        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            },
            params: new HttpParams()
                .append("plName", plName)
        };
        this.httpClient.get(this.mymApi + "/user-pref/delete-playlist", options)
        .subscribe(
            res => {
                console.log(res);
            }
        );
    }

    public async getFavSongs(){
        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            }
        };
        await this.httpClient.get<ReadonlyArray<string>>(this.mymApi + "/user-pref/fav",options)
        .subscribe(
            titles =>{
                const query: SongQuery = {
                    in: [...titles]
                };
                this.songService.fetchSongs(this.favList, query);
            }
        );
    }

    public async getPlayLists(){
        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            }
        };
        await this.httpClient.get<ReadonlyArray<PlayListDTO>>(this.mymApi + "/user-pref/playlist",options)
        .subscribe(
            response => response.forEach(plDTO =>{
                
                const pl: PlayList = {
                    name: plDTO.plName,
                    songs: [],
                    state:{}
                }
                this.playListNames.push(plDTO.plName);
                this.playLists.push(pl);
                const query: SongQuery ={
                    in : [...plDTO.songs]
                };
                this.songService.fetchSongs(pl.songs, query);      
            })
        );

    }

    public getRecentlyPlayedSongs(){
        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            }
        };
        this.httpClient.get<ReadonlyArray<string>>(this.mymApi + "/user-pref/recent",options)
        .subscribe(
            titles =>{
                const query: SongQuery={
                    in: [...titles]
                }
                this.songService.fetchSongs(this.recents, query);
            }
        );

    }

    public addToRecent(title: string){
        this.recents.push(this.songService.getSong(title));

        const options = {
            headers: {
                "Authorization": "Bearer "+  this.userService.getOAuthToken()
            },
            params: new HttpParams().append("title", title)
        };
        this.httpClient.get(this.mymApi + "/user-pref/update-recent", options)
        .subscribe(
            res => {
                console.log(res);
            }
        );

    }


}