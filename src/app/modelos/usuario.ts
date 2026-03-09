/* Define la interfaz para un usuario. */
export interface Usuario {
  id: string;
  username: string;
  email: string;
  nombre: string;
  apellidos: string;

  /* Los IDs de elementos que referenciará. */
  historialPeliculas?: string[];
  historialReservas?: string[];
  historialResenas?: string[];
}
