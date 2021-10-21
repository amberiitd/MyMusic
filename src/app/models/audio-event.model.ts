export interface AudioEvent{
    currentPlayPoint: number;
    songDuration: number;
    currentTitle : string;
    isOnPause: boolean;
}

export const defaultEvent: AudioEvent = {
    currentPlayPoint: 0,
    songDuration: 0,
    currentTitle: "",
    isOnPause: true
}