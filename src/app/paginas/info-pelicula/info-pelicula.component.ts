/* Imports necesarios para el componente de información de película. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';
import { ResenasService } from '../../servicios/resenas.service';
import { FormsModule } from '@angular/forms';

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

  /* Constructor que inyecta los servicios necesarios para obtener la información de la película. */
  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private resenasService: ResenasService,
  ) {}

  /* Esta variable servirá para determinar la visión del formulario de reseña. */
  mostrarFormularioResena = false;

  /* Método que se ejecuta al inicializar el componente, obtiene el ID de la película de la ruta y llama al servicio para obtener su información. */
  ngOnInit(): void {
    /* Se obtiene el ID de la película desde la ruta. */
    const id = this.route.snapshot.paramMap.get('id')!;

    /* Se extraen los datos de la película gracias al id extraido antes y el servicio, para introducirla en una variable. */
    this.peliculasService.getPelicula(id).subscribe((p) => {
      this.pelicula = p;
    });

    /* Ligado al perfil, si el usuario decide escrbir una reseña, llegará hasta aquí con el query param escribirResena=true, lo que hará que se muestre el formulario. */
    this.route.queryParams.subscribe((params) => {
      this.mostrarFormularioResena = params['escribirResena'] === 'true';
    });

    /* Se obtendrá el ID del usuario desde el localStorage para comprobar si ya ha escrito una reseña de esta película y mostrarla, o permitirle escribir una nueva. */
    const usuario = JSON.parse(localStorage.getItem('usuario')!);

    /* Se obtienen las reseñas de la película. */
    this.resenasService.getResenasPelicula(id).subscribe((res) => {
      /* Se ordenan las reseñas de más recientes a más antiguas. */
      this.resenas = res.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );

      /* Se busca si el usuario ya ha escrito una reseña para esta película. */
      const existente = this.resenas.find((r) => r.usuario.id === usuario.id);

      /* Si existe una reseña del usuario, se muestra en lugar del formulario. */
      if (existente) {
        this.mostrarFormularioResena = false;
        this.resenaDelUsuario = existente;
      }
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
    if (!usuario) return;

    /* Si ya existe una reseña del usuario, se edita la existente en lugar de crear una nueva. */
    if (this.resenaDelUsuario) {
      this.resenasService
        .editarResena(this.resenaDelUsuario.id, {
          puntuacion: this.puntuacion,
          comentario: this.comentario,
        })
        .subscribe((actualizada) => {
          
          /* Actualizar la reseña del usuario. */
          Object.assign(this.resenaDelUsuario, actualizada);

          /* Actualizar también en la lista general. */
          const index = this.resenas.findIndex(
            (r) => r.id === this.resenaDelUsuario.id,
          );
          if (index !== -1) {
            this.resenas[index] = { ...this.resenas[index], ...actualizada };
          }

          /* Se actualiza la puntuación media de la película después de editar la reseña. */
          this.actualizarPuntuacionMedia();

          /* Se oculta el formulario después de editar. */
          this.mostrarFormularioResena = false;
        });

      return;
    }

    /* Si no existe una reseña del usuario, se crea una nueva. */
    this.resenasService

      /* Se llama al servicio para crear la reseña pasando los datos necesarios. */
      .crearResena({
        usuario: usuario.id,
        pelicula: this.pelicula!.id,
        puntuacion: this.puntuacion,
        comentario: this.comentario,
      })
      .subscribe((nueva) => {
        /* Añadir a la lista general. */
        this.resenas.push(nueva);

        this.resenas = this.resenas.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
        );

        /* Asignar como reseña del usuario. */
        this.resenaDelUsuario = nueva;

        /* Se actualiza la puntuación media de la película después de crear la reseña. */
        this.actualizarPuntuacionMedia();

        /* Resetear formulario. */
        this.comentario = '';
        this.puntuacion = 0;
        this.puntuacionHover = 0;

        // Ocultar formulario
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

  /* Este método se encargará de eliminar la reseña del usuario. */
  eliminarResena() {
    this.resenasService
      .eliminarResena(this.resenaDelUsuario.id)
      .subscribe(() => {
        // quitar de la lista
        this.resenas = this.resenas.filter(
          (r) => r.id !== this.resenaDelUsuario.id,
        );

        this.actualizarPuntuacionMedia();

        // permitir volver a escribir
        this.resenaDelUsuario = null;
        this.mostrarFormularioResena = true;
      });
  }

  /* Este método se encargará de mostrar el formulario de edición con los datos de la reseña del usuario. */
  activarEdicion() {
    this.comentario = this.resenaDelUsuario.comentario;
    this.puntuacion = this.resenaDelUsuario.puntuacion;
    this.mostrarFormularioResena = true;
  }

  /* Este método se encargará de actualizar la puntuación media de la película después de crear, editar o eliminar una reseña. */
  actualizarPuntuacionMedia() {
    if (this.resenas.length === 0) {
      this.pelicula!.puntuacionMedia = 0;
      return;
    }

    const suma = this.resenas.reduce((acc, r) => acc + r.puntuacion, 0);
    const media = suma / this.resenas.length;

    /* Se redondea la media a la mitad más cercana para mostrarla con estrellas. */
    const mediaRedondeada = Math.round(media * 2) / 2;

    this.pelicula!.puntuacionMedia = mediaRedondeada;
  }
}
