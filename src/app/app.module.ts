import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActionBarComponent } from './component/action-bar/action-bar.component';
import { FavoriteSongsComponent } from './component/favorite-songs/favorite-songs.component';
import { LoginComponent } from './component/login/login.component';
import { PlaylistComponent } from './component/playlist/playlist.component';
import { SongPlayerComponent } from './component/song-player/song-player.component';
import { SongComponent } from './component/song/song.component';
import { IconBtnComponent } from './icon-btn/icon-btn.component';
import { MusicHomeComponent } from './music-home/music-home.component';
import { ActivityService } from './services/activity.service';
import { UserPrefService } from './services/data/user-pref.service';
import { UserService } from './services/user.service';


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
  providers: [UserService, ActivityService, UserPrefService],
  bootstrap: [AppComponent]
})
export class AppModule { }
