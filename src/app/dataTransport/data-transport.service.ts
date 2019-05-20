import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { UrlParams } from './types/url-params';
import { SearchResponseDto } from './types/search-response.dto';
import { MovieInfoDto } from './types/item-response.dto';

const API_URL = `http://www.omdbapi.com/?apikey=${environment.OMDBApiKey}&`;

@Injectable({
    providedIn: 'root'
})
export class DataProvider {
    constructor(
        private http: HttpClient
    ) { }

    searchMovie(keyword: string): Observable<SearchResponseDto> {
        return <any>this.http.get(this.getUrlWithParams({
            s: keyword
        })).pipe(
            catchError(this.onError)
        );
    }

    getMoviesById(id: string): Observable<MovieInfoDto> {
        return <any>this.http.get(this.getUrlWithParams({
            i: id
        })).pipe(
            catchError(this.onError)
        );
    }

    private getUrlWithParams(params: UrlParams): string {
        return API_URL + Object.entries(params).map(pair => {
            return `${pair[0]}=${pair[1]}`;
        }).join('&');
    }

    private onError(error: HttpErrorResponse): Observable<never> {
        console.error(error);

        return throwError('Error while searching movie');
    }
}