/* Imports necesarios para el servicio. */
import { Injectable } from '@angular/core';

/* El servicio estará disponible en toda la aplicación. */
@Injectable({
    providedIn: 'root'
})

/* Este servicio se encargará de gestionar los mensajes de error que se mostrarán al usuario. */
export class ErroresService {

    mensajes = {
        emailDuplicado: 'Ese correo ya está registrado',
        usernameDuplicado: 'Ese nombre de usuario ya está registrado',
        usuarioNoEncontrado: 'No existe ningún usuario con ese email',
        contrasenaIncorrecta: 'La contraseña no es correcta',
        reseñaDuplicada: 'Ya has dejado una reseña para esta película',
        errorGenerico: 'Ha ocurrido un error inesperado'
    };

    /* El método get recibe una clave y devuelve el mensaje correspondiente. */
    get(key: keyof typeof this.mensajes) {
        return this.mensajes[key];
    }
}