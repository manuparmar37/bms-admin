import { Theatre } from "./theatre.model";

export interface Movie {
    id: number;
    name: string;
    cast: Cast[];
    language: string;
    genre: Genre[];
    noOfLocations: number;
    theatres: Theatre[];
}

export interface Cast {
    id: number;
    name: string;
}

export interface Genre {
    id: number;
    name: string;
}