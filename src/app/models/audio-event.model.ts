export interface AudioEvent{
    currentPlayPoint: number;
    songDuration: number;
    currentSongInfo : AudioSongInfo;
    isOnPause: boolean;
    loop: boolean;
    shuffle: boolean;
}

export const defaultEvent: AudioEvent = {
    currentPlayPoint: 0,
    songDuration: 0,
    currentSongInfo: {title: "", category: ""},
    isOnPause: true,
    loop: false,
    shuffle: false
}

export interface AudioSongInfo{
    title: string;
    category: string;
}