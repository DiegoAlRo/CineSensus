/* Define la interfaz para un usuario. */
export interface Usuario {
  id: string;
  username: string;
  nombre: string;
  apellidos: string;
  email: string;

  rol?: string;
  activo: boolean; // Indica si el usuario está activo o no
  createdAt?: string;
  
  /* Los IDs de elementos que referenciará. */
  historialPeliculas?: string[];
  historialReservas?: string[];
  historialResenas?: string[];
}