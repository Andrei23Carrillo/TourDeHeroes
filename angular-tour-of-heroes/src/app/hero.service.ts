import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Heroe } from './heroe';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

 
  getHeroes(): Observable<Heroe[]> {
    return this.http.get<Heroe[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Heroe[]>('getHeroes', []))
      );
  }

  
  getHeroNo404<Data>(id: number): Observable<Heroe> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Heroe[]>(url)
      .pipe(
        map(heroes => heroes[0]), 
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Heroe>(`getHero id=${id}`))
      );
  }

  
  getHero(id: number): Observable<Heroe> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Heroe>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Heroe>(`getHero id=${id}`))
    );
  }

  
  searchHeroes(term: string): Observable<Heroe[]> {
    if (!term.trim()) {
      
      return of([]);
    }
    return this.http.get<Heroe[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Heroe[]>('searchHeroes', []))
    );
  }

  
  addHero(hero: Heroe): Observable<Heroe> {
    return this.http.post<Heroe>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Heroe) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Heroe>('addHero'))
    );
  }

  
  deleteHero(id: number): Observable<Heroe> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Heroe>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Heroe>('deleteHero'))
    );
  }

  
  updateHero(hero: Heroe): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
     * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      
      console.error(error); 

     
      this.log(`${operation} failed: ${error.message}`);

     
      return of(result as T);
    };
  }


  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}