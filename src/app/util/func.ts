
export function formatTime(sec: number){
    var second = `${Math.floor(sec % 60)}`;
    var min = `${(Math.floor(sec / 60) % 60)}`;
    var hour = `${Math.floor(sec/ 3600)}`;

    second = second.length === 1? `0${second}`: second;
    min = min.length === 1? `0${min}`: min;
    hour = hour.length === 1? `0${hour}`: hour;

    return `${hour}:${min}:${second}`;
    
}
