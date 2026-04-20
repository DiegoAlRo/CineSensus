/* Imports necesarios para el componente de información de película. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';
import { ResenasService } from '../../servicios/resenas.service';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../servicios/reservas.service';

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
  puntuacionHover = 0;
  resenaDelUsuario: any = null;
  mostrarFormularioResena = false;

  private editarResenaId: string | null = null;

  /* Constructor que inyecta los servicios necesarios para obtener la información de la película. */
  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private resenasService: ResenasService,
    private reservasService: ReservasService,
  ) {}

  /* Método que se ejecuta al inicializar el componente, obtiene el ID de la película de la ruta y llama al servicio para obtener su información. */
  ngOnInit(): void {
    /* Se obtiene el ID de la película desde la ruta. */
    const id = this.route.snapshot.paramMap.get('id')!;

    this.route.queryParams.subscribe((params) => {
      if (params['escribirResena'] === 'true') {
        this.mostrarFormularioResena = true;
      }

      if (params['editarResena']) {
        this.editarResenaId = params['editarResena'];
      }
    });

    const usuario = JSON.parse(localStorage.getItem('usuario')!);

    this.peliculasService.getPelicula(id).subscribe((p) => {
      this.pelicula = p;

      this.reservasService
        .getReservasUsuario(usuario.id)
        .subscribe((reservas) => {
          const puedeResenar = reservas.some(
            (r) =>
              r.pelicula.id === this.pelicula!.id && r.estado === 'consumida',
          );

          this.resenasService
            .getResenasPelicula(this.pelicula!.id)
            .subscribe((res) => {
              this.resenas = res;

              if (this.editarResenaId) {
                const r = this.resenas.find(
                  (x) => x.id === this.editarResenaId,
                );
                if (r) {
                  this.resenaDelUsuario = r;
                  this.comentario = r.comentario;
                  this.puntuacion = r.puntuacion;
                  this.mostrarFormularioResena = true;
                  return;
                }
              }

              const existente = this.resenas.find(
                (r) => r.usuario.id === usuario.id,
              );

              if (existente) {
                this.resenaDelUsuario = existente;
                this.mostrarFormularioResena = false;
                return;
              }

              this.mostrarFormularioResena = puedeResenar;
            });
        });
    });
  }

  /* Este método mostrará la puntuación de la película con el número de estrellas adecuado. */
  getIconos(p: number): string[] {
    switch (p) {
      case 1:
        return ['assets/EstrellaPuntuacion-Entera.png'];

      case 1.5:
        return [
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Media.png',
        ];

      case 2:
        return [
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
        ];

      case 2.5:
        return [
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Media.png',
        ];

      case 3:
        return [
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
        ];

      case 3.5:
        return [
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Media.png',
        ];

      case 4:
        return [
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
        ];

      case 4.5:
        return [
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Media.png',
        ];

      case 5:
        return [
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
          'assets/EstrellaPuntuacion-Entera.png',
        ];

      default:
        return [];
    }
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
        this.puntuacionHover = 0;
        this.mostrarFormularioResena = false;
      });
  }

  /* Con este método se actualizará la variable de puntuaciónHover para mostrar la puntuación al pasar el ratón por las estrellas. */
  hoverPuntuacion(valor: number) {
    this.puntuacionHover = valor;
  }

  /* Con este método se actualizará la variable de puntuaciónHover a 0 para mostrar la puntuación real al quitar el ratón de las estrellas. */
  seleccionarPuntuacion(valor: number) {
    this.puntuacion = valor;
  }

  actualizarPelicula() {
    const id = this.pelicula!.id;
    this.peliculasService.getPelicula(id).subscribe((p) => {
      this.pelicula = p;
    });
  }
}
