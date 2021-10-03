import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SongComponent } from './song/song.component';
import { MusicHomeComponent } from './music-home/music-home.component';
import { FavoriteSongsComponent } from './favorite-songs/favorite-songs.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { FormsModule } from '@angular/forms';
import { SongService } from './services/song.service';
import { SongPlayerComponent } from './song-player/song-player.component';

@NgModule({
  declarations: [
    AppComponent,
    SongComponent,
    MusicHomeComponent,
    FavoriteSongsComponent,
    PlaylistComponent,
    SongPlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [SongService],
  bootstrap: [AppComponent]
})
export class AppModule { }
