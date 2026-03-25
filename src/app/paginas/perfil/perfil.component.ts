/* Imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { SelectoresDeMenuComponent } from '../../shared/selectores-de-menu/selectores-de-menu.component';
import { Usuario } from '../../modelos/usuario';

/* Constructor de la clase. */
@Component({
  selector: 'app-perfil',
  imports: [SelectoresDeMenuComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})

/* Clase del menú de perfil del usuario. */
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  iniciales: string = '';

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');

    if (data) {
      this.usuario = JSON.parse(data);

      if (this.usuario) {
        this.iniciales = this.generarIniciales(
          this.usuario.nombre,
          this.usuario.apellidos,
        );
      }
    }
  }

  /* Este método se encargará de juntar las iniciales del usuario y mostrarlas de avatar. */
  generarIniciales(nombre: string, apellidos: string): string {
    const n = nombre.charAt(0).toUpperCase();
    const a = apellidos.charAt(0).toUpperCase();
    return n + a;
  }

  /* Este método será para cerrar la sesión del usuario y devolverlo al login. */
  cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  }
  
}
