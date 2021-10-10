import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable, of, Subject} from "rxjs";
import { map } from "rxjs/operators"
import { Song, SongResponseDTO } from "src/app/models/song.model";
import { UserService } from "../user.service";
import { isEmpty } from "lodash";

@Injectable(
    {providedIn: "root"}
)
export class SongService{

    public songListSubject= new Subject<ReadonlyArray<Song>>();

    public constructor(
        private readonly httpClient: HttpClient,
        private userService: UserService
    ){
        
    }
    public init(){
        this.getSongListObservable();
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


}