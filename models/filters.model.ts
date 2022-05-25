export interface Filter {
    id: number;
    name: string;
}
export interface Filters {
    locations: Filter[];
    genres: Filter[];
    languages: Filter[];
    total_movies: number;
}