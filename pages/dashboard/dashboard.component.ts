import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Filter, Filters } from 'src/app/models/filters.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  count = {
    genres: 0,
    languages: 0,
    locations: 0,
    movies: 0,
  };
  genres: Filter[] = [];
  languages: Filter[] = [];
  locations: Filter[] = [];
  constructor(public http: HttpClient) { 
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    http.get<Filters>(environment.apiBaseUrl + 'get-filters', { headers: headers }).subscribe(filters => {
      this.count.genres = filters.genres.length;
      this.count.languages = filters.languages.length
      this.count.locations = filters.locations.length;
      this.count.movies = filters.total_movies;
      this.genres = filters.genres;
      this.languages = filters.languages;
      this.locations = filters.locations;
    });
  }

  ngOnInit(): void {
  }

}
