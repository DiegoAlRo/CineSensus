/* Imports necesarios para el servicio de usuarios. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';

/* Se indica su accesibilidad en toda la web. */
@Injectable({
  providedIn: 'root'
})

/* El servicio de usuarios se encarga de gestionar los usuarios. */
export class UsuariosService {

  /* Define la URL base para las operaciones relacionadas con los usuarios. */
  private apiUrl = 'api/usuarios';

  /* El constructor inyecta el HttpClient para realizar solicitudes HTTP al backend. */
  constructor(private http: HttpClient) {}

  /* El método addUsuario envía una solicitud POST al backend para agregar un nuevo usuario a la base de datos. */
  addUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
  
  /* El método getUsuarios envía una solicitud GET al backend para obtener la lista de usuarios registrados en la base de datos. */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }
}
