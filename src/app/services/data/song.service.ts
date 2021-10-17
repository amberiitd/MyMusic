import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Song, SongResponseDTO } from "src/app/models/song.model";
import { ActivityService } from "../activity.service";
import { UserService } from "../user.service";

@Injectable(
    {providedIn: "root"}
)
export class SongService{
    
    public songListSubject= new Subject<Array<Song>>();
    public songAudio = new Subject<{title: string, data: Blob}>(); 
    public songList: Array<Song> = [];
    private mymApi = "http://localhost:8080";

    public constructor(
        private readonly httpClient: HttpClient,
        private userService: UserService,
        private activityService: ActivityService
    ){
        
    }
    public init(){
        this.getSongListObservable();
        this.songListSubject.subscribe(
            songList => {this.songList = songList}
          );
    }

    public refresh(){
        this.getSongListObservable();
    }
    private getSongListObservable(){

        const options2 = {headers: { "Authorization": "Bearer "+ this.userService.getOAuthToken()}};
        const response=  this.httpClient.get<ReadonlyArray<SongResponseDTO>>("http://localhost:8080/song/get-all", options2)
        .pipe(
            map(response => response.map((songDTO) => {
                return {
                    title: songDTO.title, 
                    album: songDTO.album, 
                    artist: songDTO.artist, 
                    duration: songDTO.duration,
                    userPref: {}
                  } as Song;
              })
            )
        ).subscribe( response => this.songListSubject.next(response));
    }

    public fetchSong(title: string) {
        
        const options2 = {headers: { "Authorization": "Bearer "+ this.userService.getOAuthToken()}, responseType: 'blob' as 'json'};
        var audio: Blob = new Blob();
        this.httpClient.get<Blob>("http://localhost:8080/song/get-source" + "?title=" + title, options2).subscribe(
            res => {this.songAudio.next({title: title, data: res})}
        );

    }

    getSong(id: string): Song {
        return this.songList.filter(song => song.title === id)[0];
    }

    getSongsObservable(titles: ReadonlyArray<string>){
        const options = {
            headers: { "Authorization": "Bearer "+ this.userService.getOAuthToken()},
            
        };

        return this.httpClient.post<ReadonlyArray<Song>>(this.mymApi+ "/song/get-listed-songs", titles, options)
        .pipe(
            map(response => response.map((songDTO) => {
                return {
                    title: songDTO.title, 
                    album: songDTO.album, 
                    artist: songDTO.artist, 
                    duration: songDTO.duration,
                    userPref: {}
                  } as Song;
              })
            )
        );
        
    }

    public getImage(title: string) {
        const options = {
            headers: { "Authorization": "Bearer "+ this.userService.getOAuthToken()},
            responseType: 'blob' as 'json',
            params: {"title": title}
            
        };
        return this.httpClient.get<Blob>(this.mymApi + "/song/thumbnail", options);
    }


}