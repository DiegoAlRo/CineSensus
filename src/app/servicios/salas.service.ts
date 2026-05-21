/* Imports necesarios para el servicio. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sala } from '../modelos/sala';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/* Es accesible en toda la web. */
@Injectable({
  providedIn: 'root'
})

/* El servicio de salas se encarga de gestionar las salas del cine. */
export class SalasService {

  /* Define la URL base para las operaciones relacionadas con las salas. */
  private apiUrl = environment.api + '/salas';

  /* El constructor inyecta el HttpClient para realizar solicitudes HTTP al backend. */
  constructor(private http: HttpClient) {}

  /* Con este método get se podrán obtener todas las salas. */
  getSalas(): Observable<Sala[]> {
    return this.http.get<Sala[]>(this.apiUrl);
  }

  /* Con este método get se podrán obtener una sala por ID */
  getSala(id: string): Observable<Sala> {
    return this.http.get<Sala>(`${this.apiUrl}/${id}`);
  }

  /* Con este método post se podrán crear nuevas salas. */
  crearSala(datos: any): Observable<Sala> {
    return this.http.post<Sala>(this.apiUrl, datos);
  }

  /* Con este método put se podrán editar las salas. */
  editarSala(id: string, datos: any): Observable<Sala> {
    return this.http.put<Sala>(`${this.apiUrl}/${id}`, datos);
  }

  /* Con este método delete se podrán eliminar las salas. */
  eliminarSala(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}