import { Song } from "src/app/models/song.model";

export interface SongQuery{
    title?: string;
    album?: string;
    artist?: string;
    category?: string;
    or?: Array<SongQuery>;
    and?: Array<SongQuery>;
    in?: Array<string>;
    limit?: number;
    offset?: number;
}