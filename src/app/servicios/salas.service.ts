import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sala } from '../modelos/sala';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalasService {

  private apiUrl = environment.api + '/salas';

  constructor(private http: HttpClient) {}

  getSalas(): Observable<Sala[]> {
    return this.http.get<Sala[]>(this.apiUrl);
  }

  getSala(id: string): Observable<Sala> {
    return this.http.get<Sala>(`${this.apiUrl}/${id}`);
  }

  crearSala(datos: any): Observable<Sala> {
    return this.http.post<Sala>(this.apiUrl, datos);
  }

  editarSala(id: string, datos: any): Observable<Sala> {
    return this.http.put<Sala>(`${this.apiUrl}/${id}`, datos);
  }

  eliminarSala(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}