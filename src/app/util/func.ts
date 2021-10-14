
export function formatTime(sec: number){
    const second = Math.floor(sec % 60);
    const min = (Math.floor(sec / 60) % 60);
    const hour = Math.floor(sec/ 3600);

    if (hour === 0){
        return `${min}:${second}`;
    }else{
        return `${hour}:${min}:${second}`;
    }
}