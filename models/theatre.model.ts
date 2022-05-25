import { Location } from "./location.model";

export interface Theatre {
    name: string;
    timings: string[];
    location: Location;
    price: number;
}