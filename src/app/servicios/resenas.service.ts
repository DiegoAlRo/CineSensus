/* Imports necesarios para el servicio. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resena } from '../modelos/resena';
import { environment } from '../../environments/environment';

/* Es accesible en toda la web. */
@Injectable({
  providedIn: 'root'
})

/* El servicio de reseñas se encarga de gestionar las reseñas de las películas. */
export class ResenasService {

  /* Define la URL base para las operaciones relacionadas con las reseñas. */
  private apiUrl = environment.api + '/resenas';

  /* El constructor inyecta el HttpClient para realizar solicitudes HTTP al backend. */
  constructor(private http: HttpClient) {}

  /* Método para obtener todas las reseñas. */
  getTodasResenas() {
    return this.http.get<Resena[]>(`${this.apiUrl}`);
  }

  /* Método para obtener reseñas de un usuario. */
  getResenasUsuario(usuarioId: string) {
    return this.http.get<Resena[]>(`${this.apiUrl}?usuario=${usuarioId}`);
  }

  /* Método para obtener reseñas de una película. */
  getResenasPelicula(peliculaId: string) {
    return this.http.get<Resena[]>(`${this.apiUrl}?pelicula=${peliculaId}`);
  }

  /* Método para crear una reseña. */
  crearResena(datos: {
    usuario: string;
    pelicula: string;
    puntuacion: number;
    comentario: string;
  }) {
    return this.http.post<Resena>(`${this.apiUrl}`, datos);
  }

  /* Método para editar una reseña. */
  editarResena(id: string, datos: {
    puntuacion: number;
    comentario: string;
  }) {
    return this.http.put<Resena>(`${this.apiUrl}/${id}`, datos);
  }

  /* Método para eliminar una reseña. */
  eliminarResena(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}