import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { DataProvider } from 'src/app/dataTransport/data-transport.service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { MovieItemDto } from 'src/app/dataTransport/types/movie-item.dto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {

  @Output() onSelect = new EventEmitter<MovieItemDto>();

  searchMovieControl = new FormControl('');
  filteredMovies: Observable<MovieItemDto[]>;

  private subscription = new Subscription();

  constructor(
    private dataProvider: DataProvider
  ) { }

  ngOnInit(): void {
    const searchSubscription = this.searchMovieControl.valueChanges.subscribe((keyword: string) => {
      if (keyword.length < 3) {
        return;
      }
      
      this.filteredMovies = this.dataProvider.searchMovie(keyword).pipe(
        debounceTime(500),
        map(data => {
          return data.Search
        })
      );
    });
    this.subscription.add(searchSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelected(event: MatAutocompleteSelectedEvent): void {
    const movie = event.option.value;
    this.onSelect.emit(movie);

    console.log(movie);
    this.searchMovieControl.setValue('')
  }

}
