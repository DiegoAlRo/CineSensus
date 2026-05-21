/* Imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { Usuario } from '../../../modelos/usuario';
import { ToastService } from '../../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})

/* Clase del componente de lista de usuarios. */
export class UsuariosComponent implements OnInit {

  /* Propiedades del componente. */
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  filtroEmail = '';
  paginaActual = 1;
  elementosPorPagina = 10;

  /* Constructor del componente. */
  constructor(
    private usuariosService: UsuariosService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {

    /* Se cargaran los usuarios inicialmente. */
    this.cargarUsuarios();
  }

  /* Este método se encargará de cargar los usuarios desde el servicio. */
  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {

        /* Se ordenarán los usuarios en orden descendente por fecha de creación. */
        this.usuarios = data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        this.usuariosFiltrados = this.usuarios;
        this.paginaActual = 1;
      },
      error: () => this.toastService.show('Error al cargar usuarios', 'error'),
    });
  }

  /* Este método se encargará de aplicar el filtro de búsqueda. */
  aplicarFiltro() {

    /* Se obtendrá el texto especificado. */
    const email = this.filtroEmail.toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter((u) =>
      u.email.toLowerCase().includes(email),
    );
    this.paginaActual = 1;
  }

  /* Se aplicará la paginación a los usuarios filtrados. */
  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }

  /* Se obtendrán todas las páginas. */
  get totalPaginas() {
    return Math.ceil(this.usuariosFiltrados.length / this.elementosPorPagina);
  }

  /* Estos métodos servirán para navegar por las páginas. */
  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  /* Este método se encargará de cambiar el estado activo/inactivo de un usuario. */
  cambiarEstado(usuario: Usuario) {

    /* Se guardará el estado anterior del usuario. */
    const estadoAnterior = usuario.activo;

    /* Se invertirá el estado del usuario. */
    const accion = usuario.activo ? 'activar' : 'desactivar';

    /* Se le pedirá confirmación al admin. */
    if (!confirm(`¿Seguro que quieres ${accion} este usuario?`)) {
      usuario.activo = estadoAnterior;
      return;
    }

    /* Se llamará al endpoint correspondiente según el nuevo estado del usuario. */
    const endpoint = usuario.activo
      ? this.usuariosService.reactivarUsuario(usuario.id)
      : this.usuariosService.eliminarUsuario(usuario.id);

    endpoint.subscribe({
      next: () => {

        /* Se mostrará un mensaje del cambio de estado. */
        this.toastService.show(
          usuario.activo ? 'Usuario activado' : 'Usuario desactivado',
          'exito',
        );
        this.cargarUsuarios();
      },
      error: () => {
        usuario.activo = estadoAnterior;
        this.toastService.show('Error al actualizar usuario', 'error');
      },
    });
  }
}
