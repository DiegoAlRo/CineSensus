/* Se realizan los import necesarios para el servicio de películas. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sesion } from '../modelos/sesion';

@Injectable({
  providedIn: 'root',
})

/* El servicio de peliculas se encarga de gestionar las sesiones/horarios. */
export class SesionesService {

  /* URL base para el backend. */
  private apiUrl = 'http://localhost:3000';

  /* Se inyecta el HttpClient para realizar las peticiones al backend. */
  constructor(private http: HttpClient) {}

  /* Método para obtener las sesiones de una película en una fecha específica. */
  getSesiones(peliculaId: string, fecha: string): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(
      `${this.apiUrl}/sesiones?pelicula=${peliculaId}&fecha=${fecha}`,
    );
  }

  /* Método para obtener una sesión por su ID. */
  getSesionPorId(id: string) {
    return this.http.get<Sesion>(`${this.apiUrl}/sesiones/${id}`);
  }
}
