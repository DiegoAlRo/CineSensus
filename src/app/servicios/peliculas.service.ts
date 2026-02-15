import { Injectable } from '@angular/core';
import { Pelicula } from '../modelos/pelicula';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PeliculasService {

  private apiUrl = 'api/peliculas'; // URL del backend simulado
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
  
}
