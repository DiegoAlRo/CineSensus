import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resena } from '../modelos/resena';

@Injectable({
  providedIn: 'root'
})
export class ResenasService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTodasResenas() {
    return this.http.get<Resena[]>(`${this.apiUrl}/resenas`);
  }

  /* Método para obtener reseñas de un usuario. */
  getResenasUsuario(usuarioId: string) {
    return this.http.get<Resena[]>(`${this.apiUrl}/resenas?usuario=${usuarioId}`);
  }

  /* Método para obtener reseñas de una película. */
  getResenasPelicula(peliculaId: string) {
    return this.http.get<Resena[]>(`${this.apiUrl}/resenas?pelicula=${peliculaId}`);
  }

  /* Método para crear una reseña. */
  crearResena(datos: {
    usuario: string;
    pelicula: string;
    puntuacion: number;
    comentario: string;
  }) {
    return this.http.post<Resena>(`${this.apiUrl}/resenas`, datos);
  }

  /* Método para editar una reseña. */
  editarResena(id: string, datos: {
    puntuacion: number;
    comentario: string;
  }) {
    return this.http.put<Resena>(`${this.apiUrl}/resenas/${id}`, datos);
  }

  /* Método para eliminar una reseña. */
  eliminarResena(id: string) {
    return this.http.delete(`${this.apiUrl}/resenas/${id}`);
  }
}