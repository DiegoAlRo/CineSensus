/* Imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { SelectoresDeMenuComponent } from '../../shared/selectores-de-menu/selectores-de-menu.component';
import { Usuario } from '../../modelos/usuario';
import { Reserva } from '../../modelos/reserva';
import { Resena } from '../../modelos/resena';
import { ReservasService } from '../../servicios/reservas.service';
import { ResenasService } from '../../servicios/resenas.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

/* Constructor de la clase. */
@Component({
  selector: 'app-perfil',
  imports: [SelectoresDeMenuComponent, CommonModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})

/* Clase del menú de perfil del usuario. */
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  iniciales: string = '';
  reservas: Reserva[] = [];
  resenas: Resena[] = [];
  peliculasVistas: { pelicula: any; fecha: Date }[] = [];

  /* El constructor con los servicios necesarios para el funcionamiento del perfil. */
  constructor(
    private reservasService: ReservasService,
    private resenasService: ResenasService,
    private authService: AuthService,
    private router: Router,
  ) {}

  /* El método ngOnInit se encargará de cargar los datos del usuario, sus reservas, las películas vistas y las reseñas. */
  ngOnInit(): void {
    /* Se obtendrá del localStorage el usuario logueado para mostrar su información en el perfil. */
    const data = localStorage.getItem('usuario');

    if (data) {
      this.usuario = JSON.parse(data);

      /* Se usarán el nombre y apellidos del usuario para generar sus iniciales. */
      if (this.usuario) {
        this.iniciales = this.generarIniciales(
          this.usuario.nombre,
          this.usuario.apellidos,
        );
      }
    }

    /**
     * Se cargarán las reservas del usuario, y se ordenarán por fecha de sesión.
     * Además, se actualizarán los estados de las reservas si es necesario, y se extraerá la información de las películas vistas.
     * También se cargarán las reseñas del usuario, ordenándolas por fecha.
     */
    this.reservasService
      .getReservasUsuario(this.usuario!.id)
      .subscribe((res) => {
        this.reservas = res;
        this.actualizarEstadosSiEsNecesario();

        this.reservas.sort((a, b) => {
          const fechaA = this.combinarFechaHora(a.sesion.fecha, a.sesion.hora);
          const fechaB = this.combinarFechaHora(b.sesion.fecha, b.sesion.hora);
          return fechaB.getTime() - fechaA.getTime();
        });

        this.peliculasVistas = this.reservas
          .filter((r) => r.estado === 'consumida')
          .map((r) => ({
            pelicula: r.pelicula,
            fecha: this.combinarFechaHora(r.sesion.fecha, r.sesion.hora),
          }))
          .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
      });

    this.resenasService.getResenasUsuario(this.usuario!.id).subscribe((res) => {
      this.resenas = res.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );
    });
  }

  /* Este método se encargará de juntar las iniciales del usuario y mostrarlas de avatar. */
  generarIniciales(nombre: string, apellidos: string): string {
    const n = nombre.charAt(0).toUpperCase();
    const a = apellidos.charAt(0).toUpperCase();
    return n + a;
  }

  /* Este método será para cerrar la sesión del usuario y devolverlo al login. */
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /* Este método se encargará de actualizar el estado de las reservas si la fecha de la sesión ya ha pasado. */
  actualizarEstadosSiEsNecesario() {
    /* Se obtiene la fecha y hora actual. */
    const ahora = new Date();

    /**
     * Se recorren las reservas del usuario para comprobar si alguna sesión ya ha pasado y su estado sigue siendo 'pagada'.
     * En ese caso, se actualizará a 'consumida'.
     */
    this.reservas.forEach((reserva) => {
      const hora = reserva.sesion.hora.slice(0, 2);
      const minutos = reserva.sesion.hora.slice(2, 4);

      const fechaSesion = new Date(reserva.sesion.fecha);
      fechaSesion.setHours(Number(hora), Number(minutos), 0, 0);

      if (fechaSesion < ahora && reserva.estado === 'pagada') {
        reserva.estado = 'consumida';
        this.reservasService
          .actualizarEstado(reserva._id, 'consumida')
          .subscribe();
      }
    });
  }

  /* Este método se encargará de combinar la fecha y hora de la sesión para facilitar su comparación con la fecha actual. */
  combinarFechaHora(fecha: any, hora: string): Date {
    const h = Number(hora.slice(0, 2));
    const m = Number(hora.slice(2, 4));

    const d = new Date(fecha); // funciona con string o Date

    d.setHours(h, m, 0, 0);
    return d;
  }

  /* Este método comprobará si el usuario ya ha dejado una reseña para la película, para mostrar el botón de añadir reseña solo si no lo ha hecho ya. */
  tieneResena(peliculaId: string): boolean {
    return this.resenas.some((r) => r.pelicula.id === peliculaId);
  }

  /* Este método mandará al usuario a info-pelicula para escribir una reseña, indicando la intención del mismo. */
  irAResenas(peliculaId: string) {
    this.router.navigate(['/pelicula', peliculaId]);
  }

  anadirResena(peliculaId: string) {
    this.router.navigate(['/pelicula', peliculaId], {
      queryParams: { escribirResena: 'true' },
    });
  }

  editarResena(resena: Resena) {
    this.router.navigate(['/pelicula', resena.pelicula.id], {
      queryParams: { editarResena: resena.id },
    });
  }

  eliminarResena(resena: Resena) {
    this.resenasService.eliminarResena(resena.id).subscribe(() => {
      this.resenas = this.resenas.filter((r) => r.id !== resena.id);
    });
    if (this.router.url.includes('/pelicula/')) {
      const id = resena.pelicula.id;
      this.router.navigate(['/pelicula', id]);
    }
  }
}
