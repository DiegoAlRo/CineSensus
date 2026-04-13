/* Import necesario para crear un Pipe personalizado en Angular. */
import { Pipe, PipeTransform } from '@angular/core';

/* El Pipe se llama 'mapAsientos' y se puede usar en las plantillas para transformar la lista de asientos ocupados en un formato legible. */
@Pipe({
  name: 'mapAsientos',
  standalone: true,
})

/* La clase del Pipe implementa PipeTransform, lo que obliga a definir el método transform. */
export class MapAsientosPipe implements PipeTransform {
  
  /* El método transform recibe un array de asientos ocupados, donde cada asiento tiene una fila y una columna. */
  transform(asientos: { fila: number; columna: number }[]): string {
    return asientos
      .map((a) => {
        const letra = String.fromCharCode(65 + a.fila);
        return `${letra}${a.columna + 1}`;
      })
      .join(', ');
    }
}
