import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuariosService } from '../../../servicios/usuarios.service';
import { Usuario } from '../../../modelos/usuario';
import { ToastService } from '../../../servicios/toast.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  filtroEmail = '';

  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(
    private usuariosService: UsuariosService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
        this.paginaActual = 1;
      },
      error: () => this.toastService.show('Error al cargar usuarios', 'error')
    });
  }

  aplicarFiltro() {
    const email = this.filtroEmail.toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.email.toLowerCase().includes(email)
    );
    this.paginaActual = 1;
  }

  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.usuariosFiltrados.length / this.elementosPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  eliminarUsuario(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;

    this.usuariosService.actualizarUsuario(id, { rol: 'eliminado' }).subscribe({
      next: () => {
        this.toastService.show('Usuario eliminado correctamente', 'exito');
        this.cargarUsuarios();
      },
      error: () => this.toastService.show('Error al eliminar usuario', 'error')
    });
  }
}