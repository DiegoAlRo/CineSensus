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
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  filtroEmail = '';

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
      },
      error: () => this.toastService.show('Error al cargar usuarios', 'error')
    });
  }

  aplicarFiltro() {
    const email = this.filtroEmail.toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.email.toLowerCase().includes(email)
    );
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