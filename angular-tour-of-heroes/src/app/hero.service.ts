import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Heroe } from './heroe';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {

  constructor(private messageService: MessageService) { }

  getHeroes(): Observable<Heroe[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<Heroe> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id) as Heroe;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }
}
