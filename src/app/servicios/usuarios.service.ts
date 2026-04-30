/* Imports necesarios para el servicio de usuarios. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';
import { environment } from '../../environments/environment';

/* Se indica su accesibilidad en toda la web. */
@Injectable({
  providedIn: 'root',
})

/* El servicio de usuarios se encarga de gestionar los usuarios. */
export class UsuariosService {
  /* Define la URL base para las operaciones relacionadas con los usuarios. */
  private apiUrl = environment.api + '/usuarios';

  /* El constructor inyecta el HttpClient para realizar solicitudes HTTP al backend. */
  constructor(private http: HttpClient) {}

  /* El método addUsuario envía una solicitud POST al backend para agregar un nuevo usuario a la base de datos. */
  addUsuario(
    usuario: Partial<Usuario> & { password: string },
  ): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  /* Este método se encaargará de enviar los datos de inicio del usuario al backend para buscar coincidencias. */
  login(
    email: string,
    password: string,
  ): Observable<{ usuario: Usuario; token: string }> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<{ usuario: Usuario; token: string }>(url, {
      email,
      password,
    });
  }

  getUsuarios() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /* Con este GET se podrá obtener un usuario por ID. */
  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /* Este método se encargará de actualizar los datos de un usuario existente. */
  actualizarUsuario(id: string, datos: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, datos);
  }

  cambiarContrasena(datos: { id: string; contrasenaActual: string; nuevaContrasena: string }) {
    const token = localStorage.getItem('token');

    return this.http.put(`${this.apiUrl}/cambiar-contrasena`, datos, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }
}
