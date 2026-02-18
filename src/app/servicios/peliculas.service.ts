import { Injectable } from '@angular/core';
import { Pelicula } from '../modelos/pelicula';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeliculasService {
  private apiUrl = 'api/peliculas';
  constructor(private http: HttpClient) {}

  // GET: obtener todas las películas
  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.apiUrl);
  }

  // GET: obtener una película por ID
  getPelicula(id: number): Observable<Pelicula> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Pelicula>(url);
  }

  // POST: añadir una nueva película
  addPelicula(pelicula: Pelicula): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.apiUrl, pelicula);
  }

  // DELETE: eliminar una película por ID
  eliminarPelicula(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // PUT: actualizar una película existente
  actualizarPelicula(pelicula: Pelicula): Observable<Pelicula> {
    const url = `${this.apiUrl}/${pelicula.id}`;
    return this.http.put<Pelicula>(url, pelicula);
  }
}
