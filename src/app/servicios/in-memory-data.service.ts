/* Servicio de datos en memoria para simular una API RESTful utilizando angular-in-memory-web-api. */
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import { Pelicula } from '../modelos/pelicula';
import { Usuario } from '../modelos/usuario';

/* El InMemoryDataService implementa el método createDb para definir las colecciones de datos simulados. */
@Injectable({
  providedIn: 'root',
})

/* El método createDb devuelve un objeto con las colecciones de películas y usuarios, que serán utilizadas por el servicio de datos en memoria para simular las operaciones CRUD. */
export class InMemoryDataService implements InMemoryDbService {

  /* El método genId genera un nuevo ID para una película, asegurando que sea único. */
  createDb() {

    /* Se almacenarán unas películas. */
    const peliculas: Pelicula[] = [

      {
        id: 1,
        titulo: 'John Wick: Capítulo 4',
        descripcion:
          'John Wick se enfrenta a nuevos desafíos en su lucha por sobrevivir...',
        director: 'Chad Stahelski',
        genero: 'Acción',
        imagen: 'https://m.media-amazon.com/images/I/81fk-N7tvbL._AC_UF894,1000_QL80_.jpg',
      },

      {
        id: 2,
        titulo: 'Pacific Rim',
        descripcion:
          'En un futuro cercano, la humanidad se enfrenta a una amenaza de monstruos gigantes llamados Kaiju...',
        director: 'Guillermo del Toro',
        genero: 'Ciencia ficción',
        imagen: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p9360990_p_v12_at.jpg',
      },

      {
        id: 3,
        titulo: 'Amor de calendario',
        descripcion:
          'Dos personas que no se soportan se ven obligadas a compartir un calendario para organizar sus vidas y terminan enamorándose...',
        director: 'John Whitesell',
        genero: 'Comedia romántica',
        imagen: 'https://decine21.com/img/upload/obras/amor-de-calendario-42529/amor-de-calendario-42529-c.jpg',
      },

    ];

    /* Se almacenarán unos usuarios. */
    const usuarios: Usuario[] = [

      {
        id: 1,
        username: 'admin',
        email: 'admin@cine.com',
        password: '1234',
        nombre: 'Admin',
        apellidos: 'Principal',
      },

    ];

    /* Se devuelve un objeto con las colecciones de películas y usuarios. */
    return { peliculas, usuarios };
  }

  /* El método genId genera un nuevo ID para una película, asegurando que sea único. */
  genId(peliculas: Pelicula[]): number {
    return peliculas.length > 0
      ? Math.max(...peliculas.map((p) => p.id)) + 1
      : 1;
  }
}
