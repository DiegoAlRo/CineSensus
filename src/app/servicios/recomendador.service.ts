/* Imports necesarios para el servicio. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pelicula } from '../modelos/pelicula';
import { environment } from '../../environments/environment';

/* Es accesible en toda la web. */
@Injectable({
  providedIn: 'root',
})

/* El servicio de recomendador se encarga de gestionar las recomendaciones de películas. */
export class RecomendadorService {

  /* Define la URL base para las operaciones relacionadas con el recomendador. */
  private apiUrl = environment.api + '/recomendador';

  /* El constructor inyecta el HttpClient para realizar solicitudes HTTP al backend. */
  constructor(private http: HttpClient) {}

  /* Con este método post se podrán obtener recomendaciones de películas basadas en los filtros proporcionados. */
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