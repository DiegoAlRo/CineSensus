import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import { Pelicula } from '../modelos/pelicula';
import { Usuario } from '../modelos/usuario';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
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

    return { peliculas, usuarios };
  }

  genId(peliculas: Pelicula[]): number {
    return peliculas.length > 0
      ? Math.max(...peliculas.map((p) => p.id)) + 1
      : 1;
  }
}
