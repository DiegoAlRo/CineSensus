/* Define la interfaz para una sala. */
export interface Sala {
  id: string;
  nombre: string;
  filas: number;
  columnas: number;
  activo: boolean; // Indica si la sala está activa o no
  createdAt?: string;
}
