import { Injectable } from "@angular/core";
import { Observable, from } from 'rxjs';

import { MovieItemDto } from '../dataTransport/types/movie-item.dto';
import Dexie from 'dexie';
import { map } from 'rxjs/operators';

@Injectable()
export class MoviesListModel {

    static fields = ['Title', 'Type', 'Year', 'Poster', 'imdbID'];

    public moviesList: Observable<MovieItemDto[]>;

    private version = 1;
    private dbName = 'moviesDB';
    private db: any;

    constructor() {
        this.initIdexedDb();
        this.updateItems();
    }

    addItem(item: MovieItemDto): Observable<void> {
        return from(this.db.movies.add(item)).pipe(
            map(() => {
                this.updateItems();
                return;
            })
        );
    }

    removeItem(id: number): Observable<void> {
        return from(this.db.movies.delete(id)).pipe(
            map(() => {
                this.updateItems();
                return;
            })
        );
    }

    returnItemsAsCsv(): Observable<string> {
        return from(this.db.movies.toArray()).pipe(
            map((items: MovieItemDto[]) => {
                return [MoviesListModel.fields.join(', ')]
                    .concat(items.map(item => {
                        let line = [];
                        MoviesListModel.fields.forEach(key => {
                            line.push(item[key]);
                        })
                        return line.join(', ')
                    })).join('\n');
            })
        );
    }

    private initIdexedDb(): void {
        this.db = new Dexie(this.dbName);
        this.db.version(this.version).stores({
            movies: '++id,' + MoviesListModel.fields.join(', ')
        });
    }

    private updateItems(): void {
        this.moviesList = from(this.db.movies.toArray());
    }
}