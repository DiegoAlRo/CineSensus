/* imports necesarios del servicio. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pelicula } from '../modelos/pelicula';
import { environment } from '../../enviroments/environment';

/* Decorador que define el servicio. */
@Injectable({
  providedIn: 'root'
})

/* Clase del servicio de cartelera que se encarga de obtener la cartelera de películas desde el backend. */
export class CarteleraService {

  /* URL base del backend para obtener la cartelera. */
  private apiUrl = environment.api + '/cartelera';

  /* Constructor que inyecta el HttpClient para realizar peticiones HTTP. */
  constructor(private http: HttpClient) {}

  /* Método que obtiene la cartelera de películas para una fecha específica. */
  getCartelera(fecha: string): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${this.apiUrl}?fecha=${fecha}`);
  }
}