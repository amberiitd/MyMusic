
export interface Song{
    title: string;
    artist: string;
    album: string;
    duration: Duration;
    userPref: UserPreference;
}

export interface SongResponseDTO{
    title: string;
    artist: string;
    album: string;
    duration: Duration;
}

export interface Duration{
    hour: number; 
    min: number; 
    sec: number;
}

export interface UserPreference{
    favorite?: boolean;
    onPlay?: boolean;
}

export interface PlayList{
    name: string;
    songs: Song[];
    state: {
        dropDownActive?: boolean;
    }
}

export interface PlayListDTO{
    plName: string;
    songs: string[];
}