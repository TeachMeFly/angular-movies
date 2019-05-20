import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { DataProvider } from '../dataTransport/data-transport.service';
import { MovieInfoDto } from '../dataTransport/types/item-response.dto';

interface TablePair {
  label: string;
  value: string;
}

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.scss']
})
export class ItemPageComponent implements OnInit, OnDestroy {

  model: MovieInfoDto;
  displayedColumns: string[] = ['label', 'value'];

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private dataProvider: DataProvider
  ) { }

  ngOnInit(): void {
    console.log(this);
    console.log(this.route.snapshot.params.id);
    this.getModel();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDataSource(): TablePair[] {
    const tableRows = ["Title", "Year", "Rated", "Released",
      "Runtime", "Genre", "Director", "Writer", "Actors", "Plot",
      "Language", "Country", "Awards", "Metascore",
      "imdbRating", "imdbVotes", "Type", "DVD", "BoxOffice",
      "Production", "Website", "Response"];

    return Object.entries(this.model || {}).filter(pair => {
      if (tableRows.indexOf(pair[0]) > -1) {
        return true;
      } else {
        return false;
      }
    }).map(pair => {
      return {
        label: pair[0],
        value: pair[1]
      }
    });
  }

  havePoster(): boolean {
    if(this.model && this.model.Poster !== 'N/A') {
      return true;
    }
    return false;
  }

  private getModel(): void {
    this.dataProvider.getMoviesById(this.route.snapshot.params.id).pipe(take(1)).subscribe(result => {
      this.model = result;
    })
  }

}
