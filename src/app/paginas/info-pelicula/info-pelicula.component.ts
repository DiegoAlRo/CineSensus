/* Imports necesarios para el componente de información de película. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';
import { ResenasService } from '../../servicios/resenas.service';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../servicios/reservas.service';
import { ToastService } from '../../servicios/toast.service';

/* Decorador del componente con su configuración. */
@Component({
  selector: 'app-info-pelicula',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './info-pelicula.component.html',
  styleUrls: ['./info-pelicula.component.css'],
})

/* Clase del componente de información de película. */
export class InfoPeliculaComponent implements OnInit {
  pelicula?: Pelicula;
  resenas: any[] = [];
  comentario: string = '';
  puntuacion: number = 0;
  resenaDelUsuario: any = null;
  mostrarFormularioResena = false;
  puntuaciones = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  /* Constructor que inyecta los servicios necesarios para obtener la información de la película. */
  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private resenasService: ResenasService,
    private reservasService: ReservasService,
    private toastService: ToastService,
  ) {}

  /* Método que se ejecuta al inicializar el componente, obtiene el ID de la película de la ruta y llama al servicio para obtener su información. */
  ngOnInit(): void {
    /* Se obtiene el ID de la película desde la ruta. */
    const id = this.route.snapshot.paramMap.get('id')!;

    const editarResenaId =
      this.route.snapshot.queryParamMap.get('editarResena');

    this.peliculasService.getPelicula(id).subscribe({
      next: (p) => {
        this.pelicula = p;

        this.resenasService.getResenasPelicula(id).subscribe({
          next: (res) => {
            this.resenas = res;

            const usuario = JSON.parse(
              localStorage.getItem('usuario') || 'null',
            );
            if (!usuario) return;

            this.reservasService.getReservasUsuario(usuario.id).subscribe({
              next: (reservas) => {
                const puedeResenar = reservas.some(
                  (r) => r.pelicula.id === id && r.estado === 'consumida',
                );

                const existente = this.resenas.find(
                  (r) => r.usuario.id === usuario.id,
                );
                this.resenaDelUsuario = existente || null;

                if (
                  editarResenaId &&
                  this.resenaDelUsuario &&
                  this.resenaDelUsuario.id === editarResenaId
                ) {
                  this.mostrarFormularioResena = true;
                  this.comentario = this.resenaDelUsuario.comentario;
                  this.puntuacion = this.resenaDelUsuario.puntuacion;
                  return;
                }

                if (!puedeResenar && !existente) {
                  this.toastService.show(
                    'Debes haber visto la película para reseñarla',
                    'error',
                  );
                }

                this.mostrarFormularioResena = !existente && puedeResenar;
              },
              error: () => {
                this.toastService.show(
                  'No se pudieron cargar tus reservas',
                  'error',
                );
              },
            });
          },
          error: () => {
            this.toastService.show(
              'No se pudieron cargar las reseñas',
              'error',
            );
          },
        });
      },
      error: () => {
        this.toastService.show('No se pudo cargar la película', 'error');
      },
    });
  }

  /* Este método mostrará la puntuación de la película con el número de estrellas adecuado. */
  getIconos(p: number): string[] {
    if (!p) return [];
    const icons = [];
    const enteras = Math.floor(p);
    const media = p % 1 !== 0;

    for (let i = 0; i < enteras; i++)
      icons.push('assets/EstrellaPuntuacion-Entera.png');
    if (media) icons.push('assets/EstrellaPuntuacion-Media.png');

    return icons;
  }

  /* Este método se encargará de enviar la reseña al backend tanto para crear una nueva o editar una existente. */
  enviarResena() {
    /* Se obtiene el usuario desde el localStorage para saber quién escribe la reseña. */
    const usuario = JSON.parse(localStorage.getItem('usuario')!);
    if (!usuario || !this.pelicula) return;

    if (this.resenaDelUsuario) {
      this.resenasService
        .editarResena(this.resenaDelUsuario.id, {
          puntuacion: this.puntuacion,
          comentario: this.comentario,
        })
        .subscribe((actualizada) => {
          this.resenaDelUsuario = { ...this.resenaDelUsuario, ...actualizada };
          const idx = this.resenas.findIndex(
            (r) => r.id === this.resenaDelUsuario.id,
          );
          if (idx !== -1) {
            this.resenas[idx] = { ...this.resenas[idx], ...actualizada };
          }

          this.actualizarPelicula();
          this.mostrarFormularioResena = false;

          this.toastService.show('Reseña actualizada', 'exito');
        });

      return;
    }

    this.resenasService
      .crearResena({
        usuario: usuario.id,
        pelicula: this.pelicula.id,
        puntuacion: this.puntuacion,
        comentario: this.comentario,
      })
      .subscribe((nueva) => {
        this.resenas.push(nueva);
        this.resenas = this.resenas.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
        );

        this.resenaDelUsuario = nueva;
        this.actualizarPelicula();

        this.comentario = '';
        this.puntuacion = 0;
        this.mostrarFormularioResena = false;

        this.toastService.show('Reseña creada correctamente', 'exito');
      });
  }

  actualizarPelicula() {
    const id = this.pelicula!.id;
    this.peliculasService.getPelicula(id).subscribe((p) => {
      this.pelicula = p;
    });
  }
}
