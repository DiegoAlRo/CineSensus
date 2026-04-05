/* Imports necesarios para el servicio de usuarios. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';

/* Se indica su accesibilidad en toda la web. */
@Injectable({
  providedIn: 'root',
})

/* El servicio de usuarios se encarga de gestionar los usuarios. */
export class UsuariosService {
  
  /* Define la URL base para las operaciones relacionadas con los usuarios. */
  private apiUrl = 'http://localhost:3000/usuarios';

  /* El constructor inyecta el HttpClient para realizar solicitudes HTTP al backend. */
  constructor(private http: HttpClient) {}

  /* El método addUsuario envía una solicitud POST al backend para agregar un nuevo usuario a la base de datos. */
  addUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  /* Este método se encaargará de enviar los datos de inicio del usuario al backend para buscar coincidencias. */
  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/usuarios/login', {
      email,
      password,
    });
  }

  /* Con este GET se podrá obtener un usuario por ID. */
  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /* Este método se encargará de actualizar los datos de un usuario existente. */
  actualizarUsuario(id: string, datos: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, datos);
  }
}
