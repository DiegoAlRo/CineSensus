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
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../servicios/toast.service';

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

  cargandoReservas: boolean = false;
  cargandoPeliculasVistas: boolean = false;
  cargandoResenas: boolean = false;

  /* El constructor con los servicios necesarios para el funcionamiento del perfil. */
  constructor(
    private reservasService: ReservasService,
    private resenasService: ResenasService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  /* El método ngOnInit se encargará de cargar los datos del usuario, sus reservas, las películas vistas y las reseñas. */
  async ngOnInit(): Promise<void> {
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

    if (!this.usuario) return;

    this.cargandoReservas = true;

    try {
      const reservas = await firstValueFrom(
        this.reservasService.getReservasUsuario(this.usuario.id),
      );

      this.reservas = reservas;

      await this.actualizarEstadosSiEsNecesario();

      this.reservas.sort((a, b) => {
        const fechaA = this.combinarFechaHora(a.sesion.fecha, a.sesion.hora);
        const fechaB = this.combinarFechaHora(b.sesion.fecha, b.sesion.hora);
        return fechaB.getTime() - fechaA.getTime();
      });
    } catch {
      this.toastService.show('Error al cargar tus reservas', 'error');
    }

    this.cargandoReservas = false;

    this.cargandoPeliculasVistas = true;

    try {
      const vistas = new Map<string, { pelicula: any; fecha: Date }>();

      this.reservas
        .filter((r) => r.estado === 'consumida')
        .forEach((r) => {
          const peliculaId = r.pelicula.id;
          const fecha = this.combinarFechaHora(r.sesion.fecha, r.sesion.hora);

          if (
            !vistas.has(peliculaId) ||
            vistas.get(peliculaId)!.fecha < fecha
          ) {
            vistas.set(peliculaId, { pelicula: r.pelicula, fecha });
          }
        });

      this.peliculasVistas = Array.from(vistas.values()).sort(
        (a, b) => b.fecha.getTime() - a.fecha.getTime(),
      );
    } catch {
      this.toastService.show('Error al cargar películas vistas', 'error');
    }

    this.cargandoPeliculasVistas = false;

    this.cargandoResenas = true;

    try {
      const resenas = await firstValueFrom(
        this.resenasService.getResenasUsuario(this.usuario.id),
      );

      this.resenas = resenas.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );
    } catch {
      this.toastService.show('Error al cargar tus reseñas', 'error');
    }

    this.cargandoResenas = false;
  }

  /* Este método se encargará de juntar las iniciales del usuario y mostrarlas de avatar. */
  generarIniciales(nombre: string, apellidos: string): string {
    return nombre.charAt(0).toUpperCase() + apellidos.charAt(0).toUpperCase();
  }

  cambiarContrasena() {
    this.router.navigate(['/cambiar-contrasena']);
  }

  /* Este método será para cerrar la sesión del usuario y devolverlo al login. */
  cerrarSesion() {
    this.authService.logout();
    this.toastService.show('Sesión cerrada correctamente', 'exito');
    this.router.navigate(['/login']);
  }

  /* Este método se encargará de actualizar el estado de las reservas si la fecha de la sesión ya ha pasado. */
  async actualizarEstadosSiEsNecesario(): Promise<void> {
    const ahora = new Date();

    const reservasParaActualizar = this.reservas.filter((reserva) => {
      const hora = reserva.sesion.hora.slice(0, 2);
      const minutos = reserva.sesion.hora.slice(2, 4);

      const fechaSesion = new Date(reserva.sesion.fecha);
      fechaSesion.setHours(Number(hora), Number(minutos), 0, 0);

      return fechaSesion < ahora && reserva.estado === 'pagada';
    });

    if (reservasParaActualizar.length === 0) return;

    await Promise.all(
      reservasParaActualizar.map((reserva) =>
        this.reservasService
          .actualizarEstado(reserva.id, 'consumida')
          .toPromise(),
      ),
    );

    reservasParaActualizar.forEach((reserva) => {
      reserva.estado = 'consumida';
    });
  }

  /* Este método se encargará de combinar la fecha y hora de la sesión para facilitar su comparación con la fecha actual. */
  combinarFechaHora(fecha: any, hora: string): Date {
    const h = Number(hora.slice(0, 2));
    const m = Number(hora.slice(2, 4));

    const d = new Date(fecha);
    d.setHours(h, m, 0, 0);
    return d;
  }

  verEntrada(reserva: Reserva) {
    this.router.navigate(['/entrada', reserva.id]);
  }

  /* Este método mandará al usuario a info-pelicula para escribir una reseña, indicando la intención del mismo. */
  irAResenas(peliculaId: string) {
    this.router.navigate(['/pelicula', peliculaId]);
  }

  editarResena(resena: Resena) {
    this.router.navigate(['/pelicula', resena.pelicula.id], {
      queryParams: { editarResena: resena.id },
    });
  }

  eliminarResena(resena: Resena) {
    this.resenasService.eliminarResena(resena.id).subscribe({
      next: () => {
        this.resenas = this.resenas.filter((r) => r.id !== resena.id);
        this.toastService.show('Reseña eliminada correctamente', 'exito');

        if (this.router.url.includes('/pelicula/')) {
          const id = resena.pelicula.id;
          this.router.navigate(['/pelicula', id]);
        }
      },
      error: () => {
        this.toastService.show('No se pudo eliminar la reseña', 'error');
      },
    });
  }
}
