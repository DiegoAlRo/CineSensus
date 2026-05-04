import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pelicula } from '../modelos/pelicula';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class RecomendadorService {
  private apiUrl = environment.api + '/recomendador';

  constructor(private http: HttpClient) {}

  recomendarPelicula(filtros: {
    genero: string | null;
    tono: string | null;
    duracion: string | null;
    edad: number | null;
    puntuacion: number | null;
  }): Observable<Pelicula | null> {
    return this.http.post<Pelicula | null>(this.apiUrl, filtros);
  }
}