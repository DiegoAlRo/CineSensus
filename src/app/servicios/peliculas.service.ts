/* Se realizan los import necesarios para el servicio de películas. */
import { Injectable } from '@angular/core';
import { Pelicula } from '../modelos/pelicula';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/* Es accesible en toda la web. */
@Injectable({
  providedIn: 'root',
})

/* El servicio de peliculas se encarga de gestionar las películas. */
export class PeliculasService {
  /* Define la URL base para las operaciones relacionadas con las películas. */
  private apiUrl = environment.api + '/peliculas';

  /* El constructor inyecta el HttpClient para realizar solicitudes HTTP al backend. */
  constructor(private http: HttpClient) {}

  /* Con este método get se podrán obtener todas las películas. */
  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.apiUrl);
  }

  /* Con este método get se podrán obtener una película por ID */
  getPelicula(id: string): Observable<Pelicula> {
    return this.http.get<Pelicula>(`${this.apiUrl}/${id}`);
  }

  crearPelicula(datos: any): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.apiUrl, datos);
  }

  editarPelicula(id: string, datos: any): Observable<Pelicula> {
    return this.http.put<Pelicula>(`${this.apiUrl}/${id}`, datos);
  }

  eliminarPelicula(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
