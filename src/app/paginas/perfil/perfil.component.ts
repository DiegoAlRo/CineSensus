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
  styleUrls: ['./perfil.component.css'],
})

/* Clase del menú de perfil del usuario. */
export class PerfilComponent implements OnInit {

  /* propiedades del componente. */
  usuario: Usuario | null = null;
  iniciales: string = '';
  reservas: Reserva[] = [];
  todasReservas: Reserva[] = [];
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

      /* Se extraerá la información del usuario. */
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

    /* Se detectará si el usuario no está activo, para avisarle y redirigirle. */
    if (this.usuario.activo === false) {
      this.toastService.show('Tu cuenta ha sido desactivada', 'error');
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    /* Se avisa al programa de que las reservas se están cargando. */
    this.cargandoReservas = true;

    try {

      /* Se buscarán las reseras del usuario. */
      let reservas = await firstValueFrom(
        this.reservasService.getReservasUsuario(this.usuario.id),
      );

      /* Se obtendrán y almacenarán todas las reservas para luego filtrarlas. */
      this.todasReservas = reservas;
      this.reservas = reservas.filter((r) => r.sesion && r.sesion.sala);

      /* Se revisará el estado de las reservas, por si alguna ha pasado de pagada a consumida o ha sido cancelada. */
      await this.actualizarEstadosSiEsNecesario();

      /* Se ordenarán las reservas en orden descendente. */
      this.reservas.sort((a, b) => {
        if (!a.sesion || !a.sesion.hora) return 1;
        if (!b.sesion || !b.sesion.hora) return -1;

        const fechaA = this.combinarFechaHora(a.sesion.fecha, a.sesion.hora);
        const fechaB = this.combinarFechaHora(b.sesion.fecha, b.sesion.hora);
        return fechaB.getTime() - fechaA.getTime();
      });
    } catch {
      this.toastService.show('Error al cargar tus reservas', 'error');
    }

    /* Se avisará al programa de que ya no se están cargando las reservas.*/
    this.cargandoReservas = false;

    /* Se avisará al programa de que se está cargando el histrial de películas. */
    this.cargandoPeliculasVistas = true;

    try {

      /* A la hora de montar la lista de películas, se evitarán duplicados y será ordenado. */
      const vistas = new Map<string, { pelicula: any; fecha: Date }>();

      /* Las películas se obtendrán de las reservas consumidas. */
      this.todasReservas
        .filter((r) => r.estado === 'consumida')
        .forEach((r) => {
          if (!r.pelicula) return;
          const peliculaId = r.pelicula.id;
          let fecha = new Date(0);

          /* Se obtendrá la fecha de la sesión para ordenar las películas. */
          if (r.sesion && r.sesion.fecha && r.sesion.hora) {
            fecha = this.combinarFechaHora(r.sesion.fecha, r.sesion.hora);
          }

          const actual = vistas.get(peliculaId);

          if (!actual || actual.fecha < fecha) {
            vistas.set(peliculaId, { pelicula: r.pelicula, fecha });
          }
        });

        /* El map de películas se transformará a array. */
      this.peliculasVistas = Array.from(vistas.values()).sort(
        (a, b) => b.fecha.getTime() - a.fecha.getTime(),
      );
    } catch {
      this.toastService.show('Error al cargar películas vistas', 'error');
    }

    /* Se avisará al programa que se han dejado de cargar las películas vistas. */
    this.cargandoPeliculasVistas = false;

    /* Se avisará al programa de que se están cargando las reseñas. */
    this.cargandoResenas = true;

    try {

      /* Se obtendrán las reseñas del usuario. */
      let resenas = await firstValueFrom(
        this.resenasService.getResenasUsuario(this.usuario.id),
      );

      /* Se filtrarán las reseñas válidas. */
      resenas = resenas.filter((r) => r.usuario && r.pelicula);

      /* Se ordenarán las reseñas en orden descendente. */
      this.resenas = resenas.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );
    } catch {
      this.toastService.show('Error al cargar tus reseñas', 'error');
    }

    /* Se avisa al progama de que ya no se están cargando las reseñas. */
    this.cargandoResenas = false;
  }

  /* Este método se encargará de juntar las iniciales del usuario y mostrarlas de avatar. */
  generarIniciales(nombre: string, apellidos: string): string {
    return (
      nombre.charAt(0).toUpperCase() + '.' +
      apellidos.charAt(0).toUpperCase() + '.'
    );
  }

  /* Este método enviará al usuario a la página de cambio de contraseña. */
  cambiarContrasena() {
    this.router.navigate(['/cambiar-contrasena']);
  }

  /* Este método será para cerrar la sesión del usuario y devolverlo al login. */
  cerrarSesion() {
    this.authService.logout();
    localStorage.removeItem('fechaSeleccionada');
    this.toastService.show('Sesión cerrada correctamente', 'exito');
    this.router.navigate(['']);
  }

  /* Este método se encargará de actualizar el estado de las reservas si la fecha de la sesión ya ha pasado. */
  async actualizarEstadosSiEsNecesario(): Promise<void> {

    /* Se obtiene la fecha actual. */
    const ahora = new Date();

    /* Se filtrarán las reservas que deben actualizarse. */
    const reservasParaActualizar = this.reservas.filter((reserva) => {
      if (!reserva.sesion) return false;
      if (!reserva.sesion.hora) return false;

      /* Se obtienen la hora y los minutos. */
      const hora = reserva.sesion.hora.slice(0, 2);
      const minutos = reserva.sesion.hora.slice(2, 4);

      const fechaISO = new Date(reserva.sesion.fecha)
        .toISOString()
        .slice(0, 10);

        /* Se creará la fecha completa para comparar. */
      const fechaSesion = new Date(`${fechaISO}T${hora}:${minutos}:00`);

      /* De no haber pasado la hora de la sesión, la reserva pasará a pagada. */
      return fechaSesion < ahora && reserva.estado === 'pagada';
    });

    if (reservasParaActualizar.length === 0) return;

    /* En caso de que la hora de la sesión de la reserva haya pasado, se marcará como consumida. */
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

    const fechaISO = new Date(fecha).toISOString().slice(0, 10);
    return new Date(`${fechaISO}T${hora.slice(0, 2)}:${hora.slice(2, 4)}:00`);
  }

  /* Este método le mostrará la entrada de una reserva al usuario. */
  verEntrada(reserva: Reserva) {
    this.router.navigate(['/entrada', reserva.id]);
  }

  /* Este método mandará al usuario a info-pelicula para escribir una reseña, indicando la intención del mismo. */
  irAResenas(peliculaId: string) {
    this.router.navigate(['/pelicula', peliculaId]);
  }

  /* Con este m´todo el usuario podrá ir a las reseñas a editar la suya. */
  editarResena(resena: Resena) {

    /* Se comprobará si la película existe y se le avisará al usuario de lo contrario. */
    if (!resena.pelicula) {
      this.toastService.show('La película ya no está disponible', 'error');
      return;
    }

    this.router.navigate(['/pelicula', resena.pelicula.id], {
      queryParams: { editarResena: resena.id },
    });
  }

  /* Este método eliminará la reseña del usuario. */
  eliminarResena(resena: Resena) {

    /* Se llamará al servicio. */
    this.resenasService.eliminarResena(resena.id).subscribe({
      next: () => {
        this.resenas = this.resenas.filter((r) => r.id !== resena.id);

        /* Se avisará al usuario de la eliminación. */
        this.toastService.show('Reseña eliminada correctamente', 'exito');

        if (this.router.url.includes('/pelicula/') && resena.pelicula) {
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
