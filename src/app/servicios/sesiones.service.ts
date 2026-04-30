/* Se realizan los import necesarios para el servicio de películas. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sesion } from '../modelos/sesion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

/* El servicio de peliculas se encarga de gestionar las sesiones/horarios. */
export class SesionesService {

  /* URL base para el backend. */
  private apiUrl = environment.api + '/sesiones';

  /* Se inyecta el HttpClient para realizar las peticiones al backend. */
  constructor(private http: HttpClient) {}

  crearSesion(datos: any): Observable<Sesion> {
    return this.http.post<Sesion>(this.apiUrl, datos);
  }

  editarSesion(id: string, datos: any): Observable<Sesion> {
    return this.http.put<Sesion>(`${this.apiUrl}/${id}`, datos);
  }

  eliminarSesion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getTodas(): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(this.apiUrl);
  }

  /* Método para obtener una sesión por su ID. */
  getSesion(id: string): Observable<Sesion> {
    return this.http.get<Sesion>(`${this.apiUrl}/${id}`);
  }

  /* Método para obtener las sesiones de una película en una fecha específica. */
  getSesionesFiltradas(peliculaId: string, fecha: string): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(
      `${this.apiUrl}/filtrar?pelicula=${peliculaId}&fecha=${fecha}`,
    );
  }
}
