import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SongComponent } from './component/song/song.component';
import { MusicHomeComponent } from './music-home/music-home.component';
import { FavoriteSongsComponent } from './component/favorite-songs/favorite-songs.component';
import { PlaylistComponent } from './component/playlist/playlist.component';
import { FormsModule } from '@angular/forms';
import { SongService } from './services/data/song.service';
import { SongPlayerComponent } from './component/song-player/song-player.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './component/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './services/user.service';
import { DisplayService } from './services/display.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import { IconBtnComponent } from './icon-btn/icon-btn.component';
import { ActionBarComponent } from './component/action-bar/action-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SongComponent,
    MusicHomeComponent,
    FavoriteSongsComponent,
    PlaylistComponent,
    SongPlayerComponent,
    LoginComponent,
    IconBtnComponent,
    ActionBarComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule
  ],
  providers: [UserService, DisplayService],
  bootstrap: [AppComponent]
})
export class AppModule { }
