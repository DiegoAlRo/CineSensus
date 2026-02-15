import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import { Pelicula } from '../modelos/pelicula';

@Injectable({
    providedIn: 'root'
})

export class InMemoryDataService implements InMemoryDbService {

    createDb() {

        const peliculas: Pelicula[] = [

            {
                id: 1, titulo: 'Interstellar',
                descripcion: 'Un grupo de astronautas viaja a través de un agujero de gusano...',
                genero: 'Ciencia ficción',
                imagen: 'assets/interstellar.jpg'
            },

            { id: 2,
                titulo: 'Inception',
                descripcion: 'Un ladrón que roba secretos a través de los sueños...',
                genero: 'Acción',
                imagen: 'assets/inception.jpg'
            },

            { id: 3, titulo: 'La La Land',
                descripcion: 'Una historia de amor entre un pianista y una actriz...',
                genero: 'Musical',
                imagen: 'assets/lalaland.jpg'
            }
            
        ];
        
        return { peliculas };
    }
    
    genId(peliculas: Pelicula[]): number {
        return peliculas.length > 0 ? Math.max(...peliculas.map(p => p.id)) + 1 : 1;
    }
}