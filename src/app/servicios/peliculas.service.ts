/* Se realizan los import necesarios para el servicio de películas. */
import { Injectable } from '@angular/core';
import { Pelicula } from '../modelos/pelicula';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeliculasService {
  private apiUrl = 'http://localhost:3000/peliculas';
  constructor(private http: HttpClient) {}

  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((peliculas) =>
        peliculas.map((p) => ({
          ...p,
          id: p._id, // ← transformamos _id en id
        })),
      ),
    );
  }

  /* GET: obtener una película por ID */
  getPelicula(id: string): Observable<Pelicula> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((p) => ({
        ...p,
        id: p._id, // ← igual aquí
      })),
    );
  }
}
