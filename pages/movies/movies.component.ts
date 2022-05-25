import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Filters } from 'src/app/models/filters.model';
import { Location } from 'src/app/models/location.model';
import { Movie } from 'src/app/models/movie.model';
import { Theatre } from 'src/app/models/theatre.model';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  showDetailItem = false;
  showDetailItemId: number = 0;
  allLocations: Location[] = [];
  selectedMovie: Movie = {} as Movie;
  selectedTheatres: Theatre[] = [];
  movies: Movie[] = [];
  filters: Filters = {} as Filters;
  filteredLocationIds: number[] = [];
  filteredLanguageIds: number[] = [];
  filteredGenreIds: number[] = [];
  constructor(private http: HttpClient) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    http.get<Filters>(environment.apiBaseUrl + 'get-filters', { headers: headers }).subscribe(filters => {
      this.filters = filters;
    });
  }

  ngOnInit(): void {
    this.getMovies();
  }
  toggleShowDetail(movie: Movie): void {
    this.showDetailItem = !(this.showDetailItem && this.showDetailItemId == movie.id);
    if (this.showDetailItem) {
      this.showDetailItemId = movie.id;
      this.allLocations = this.getLocations(movie);
      this.selectedMovie = movie;
    }
  }
  getLocations(movie: Movie): Location[] {
    const allLocations: Location[] = [];
    const locationsMap: Map<number, Location> = new Map<number, Location>();
    movie.theatres.forEach((theatre: Theatre) => {
      locationsMap.set(theatre.location.id, theatre.location);
    });
    locationsMap.forEach((location: Location) => {
      allLocations.push(location);
    })
    return allLocations;
  }
  getTheatresHavingSelectedLocation(location: Location): Theatre[] {
    const theatres: Theatre[] = [];
    this.selectedMovie?.theatres.forEach((theatre: Theatre) => {
      if (theatre.location.id == location.id) {
        theatres.push(theatre);
      }
    });
    console.log('ALL THEATRES', [theatres]);
    return theatres;
  }
  getNameArray(arr: any[]) {
    return arr.map((val: any) => val.name);
  }
  selectionChangeLocation(event: MatOptionSelectionChange, filterType: string) {
    const val = event.source.value, selected = event.source.selected;
    switch (filterType) {
      case 'locations':
        this.filteredLocationIds = this.filterChange(this.filteredLocationIds, val, selected);
        break;
      case 'languages':
        this.filteredLanguageIds = this.filterChange(this.filteredLanguageIds, val, selected);
        break;
      case 'genres':
        this.filteredGenreIds = this.filterChange(this.filteredGenreIds, val, selected);
        break;
    }
    this.getMovies();
  }
  public filterChange(arr: number[], value: number, selected: boolean): number[] {
    selected ? arr.push(value) : arr = arr.filter(val => val != value);
    return arr;
  }
  public getMovies(): void {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    this.http.get<Movie[]>(environment.apiBaseUrl + 'get-movies' + '?location_ids=' + this.filteredLocationIds + '&language_ids=' + this.filteredLanguageIds + '&genre_ids=' + this.filteredGenreIds, { headers: headers }).subscribe(movies => {
      this.movies = movies.map((x: Movie) => this.copySelectedMovie(x));
    });
  }
  public copySelectedMovie(movie: Movie): Movie {
    let theatreNames: string[] = [];
    movie.theatres.forEach((theatre: Theatre) => {
      theatreNames.push(theatre.name);
    });
    const theatres: Theatre[] = [];
    movie.theatres.forEach(theatre => {
      if (theatreNames.indexOf(theatre.name) != -1 && this.filteredLocationIds.indexOf(theatre.location.id) != -1) {
        theatres.push(theatre);
        theatreNames = theatreNames.filter(name => name != theatre.name);
      }
    });
    movie.theatres = theatres;
    if(this.filteredLocationIds.length) {
      movie.noOfLocations = theatres.length;
    }
    return movie;
  }
}
