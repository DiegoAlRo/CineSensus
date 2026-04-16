/* Define la interfaz para un usuario. */
export interface Usuario {
  id: string;
  username: string;
  nombre: string;
  apellidos: string;
  email: string;
  
  /* Los IDs de elementos que referenciará. */
  historialPeliculas?: string[];
  historialReservas?: string[];
  historialResenas?: string[];
}
