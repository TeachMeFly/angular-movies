import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { MoviesListModel } from './items-list.model';
import { MovieItemDto } from '../dataTransport/types/movie-item.dto';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();

  constructor(
    private model: MoviesListModel
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMovies(): Observable<MovieItemDto[]> {
    return this.model.moviesList;
  }

  onAddMovie(item: MovieItemDto): void {
    this.model.addItem(item).subscribe();
  }

  onDeleteItem(event: Event, item: MovieItemDto): void {
    event.stopPropagation();
    this.model.removeItem(item.id).subscribe();
  }

  onSaveList(): void {
    this.model.returnItemsAsCsv().pipe(take(1)).subscribe(csv => {
      const blob = new Blob([csv], {
        type: "text/csv;charset=UTF-8"
      });
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = 'movies-list.csv';
      a.click();

      window.URL.revokeObjectURL(blobUrl);
    });
  }

}
