import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Song, SongResponseDTO } from "src/app/models/song.model";
import { ActivityService } from "../activity.service";
import { UserService } from "../user.service";
import { SongQuery } from "./songQuery.model";

@Injectable(
    {providedIn: "root"}
)
export class SongService{
    
    public songListSubject= new Subject<Array<Song>>();
    public songAudio = new Subject<{title: string, data: Blob}>(); 
    public localSongRepo: Array<Song> = [];
    private mymApi = "http://localhost:8080";

    public constructor(
        private readonly httpClient: HttpClient,
        private userService: UserService,
        private activityService: ActivityService
    ){
        
    }
    public init(){
        this.fetchSongs([], {});
    }
    public fetchSongs(songList: Array<Song>, query: SongQuery){

        const options2 = {headers: { "Authorization": "Bearer "+ this.userService.getOAuthToken()}};
        const response=  this.httpClient.post<ReadonlyArray<SongResponseDTO>>("http://localhost:8080/song/query", query, options2)
        .pipe(
            map(response => this.mapToSong(response))
        ).subscribe( response => {
            songList.push(...response);
            this.pushToRepo(response);
            this.songListSubject.next(response);
        });
    }

    public fetchSongBlob(title: string, blob: {data: Blob}) {
        
        const options2 = {headers: { "Authorization": "Bearer "+ this.userService.getOAuthToken()}, responseType: 'blob' as 'json'};
        return this.httpClient.get<Blob>("http://localhost:8080/song/get-source" + "?title=" + title, options2);
    }

    getSong(id: string): Song {
        return this.localSongRepo.filter(song => song.title === id)[0];
    }

    public getImage(title: string, img: {data: any}) {
        const song = this.getSong(title);
        if (song.img){
            this.setImgString(song.img, img);
            return;
        }
        const options = {
            headers: { "Authorization": "Bearer "+ this.userService.getOAuthToken()},
            responseType: 'blob' as 'json',
            params: {"title": title}
            
        };
        const response = this.httpClient.get<Blob>(this.mymApi + "/song/thumbnail", options).subscribe(
            res =>{
                this.setImgString(res, img);
                const index = this.localSongRepo.findIndex(s => s.title === title);
                this.localSongRepo[index].img = res;
            }
        );
    }

    private setImgString(blob: Blob, img: {data: any}){
        var reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onload = (e) => {
            img.data = e.target?.result;
        };
    }

    private mapToSong(response: Readonly<SongResponseDTO[]>){
        return response.map(songDTO => {
            return {
                title: songDTO.title, 
                album: songDTO.album, 
                artist: songDTO.artist, 
                duration: songDTO.duration,
                userPref: {}
              } as Song;
          }
        );
    }

    private pushToRepo(songs: Song[]){
        songs.forEach(song =>{
            const index = this.localSongRepo.findIndex( s => s.title === song.title);
            if (index < 0){
                this.localSongRepo.push(song);
            }
        });
    }


}