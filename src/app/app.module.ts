import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SongComponent } from './song/song.component';
import { MusicHomeComponent } from './music-home/music-home.component';
import { FavoriteSongsComponent } from './favorite-songs/favorite-songs.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { FormsModule } from '@angular/forms';
import { SongService } from './services/data/song.service';
import { SongPlayerComponent } from './song-player/song-player.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './services/user.service';
import { DisplayService } from './services/display.service';

@NgModule({
  declarations: [
    AppComponent,
    SongComponent,
    MusicHomeComponent,
    FavoriteSongsComponent,
    PlaylistComponent,
    SongPlayerComponent,
    LoginComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UserService, DisplayService],
  bootstrap: [AppComponent]
})
export class AppModule { }
