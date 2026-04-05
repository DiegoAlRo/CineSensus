/* Imports necesarios para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SesionesService } from '../../servicios/sesiones.service';
import { Sesion } from '../../modelos/sesion';
import { Sala } from '../../modelos/sala';
import { MapAsientosPipe } from '../../pipes/map-asientos.pipe';

/* Componente para mostrar los asientos disponibles de una sesión. */
@Component({
  selector: 'app-asientos',
  standalone: true,
  imports: [CommonModule, MapAsientosPipe],
  templateUrl: './asientos.component.html',
  styleUrls: ['./asientos.component.css'],
})

/* La clase del componente, que implementa OnInit para cargar los datos al iniciar. */
export class AsientosComponent implements OnInit {
  /* Se almacenan la sesión, la sala y la matriz de asientos para mostrarlas en la plantilla. */
  sesion!: Sesion;
  sala!: Sala;
  matrizAsientos: any[][] = [];
  asientosSeleccionados: { fila: number; col: number }[] = [];

  /* Se inyectan los servicios necesarios para obtener la sesión y sus datos relacionados. */
  constructor(
    private route: ActivatedRoute,
    private sesionesService: SesionesService,
  ) {}

  /* Al iniciar el componente, se obtiene el ID de la sesión desde la ruta y se carga la sesión correspondiente. */
  ngOnInit() {
    const idSesion = this.route.snapshot.paramMap.get('idSesion');

    if (!idSesion) return;

    this.sesionesService.getSesionPorId(idSesion).subscribe((sesion) => {
      console.log("SESION RECIBIDA:", sesion);
      this.sesion = sesion;
      this.sala = sesion.sala;
      this.generarMatrizDeAsientos();
    });
  }

  /* Método para generar una matriz de asientos teniendo en cuenta los libres y los asientos ocupados. */
  generarMatrizDeAsientos() {
    this.matrizAsientos = [];

    for (let fila = 0; fila < this.sala.filas; fila++) {
      const filaAsientos = [];
      for (let col = 0; col < this.sala.columnas; col++) {
        filaAsientos.push({
          fila,
          col,
          ocupado: this.sesion.asientosOcupados.some(
            (a) => a.fila === fila && a.columna === col,
          ),
          seleccionado: false,
        });
      }
      this.matrizAsientos.push(filaAsientos);
    }
  }

  toggleAsiento(asiento: any) {
    if (asiento.ocupado) return;

    asiento.seleccionado = !asiento.seleccionado;

    if (asiento.seleccionado) {
      this.asientosSeleccionados.push({ fila: asiento.fila, col: asiento.col });
    } else {
      this.asientosSeleccionados = this.asientosSeleccionados.filter(
        (a) => !(a.fila === asiento.fila && a.col === asiento.col),
      );
    }
  }

  formatearAsiento(a: { fila: number; col: number }) {
    const letra = String.fromCharCode(65 + a.fila); // 65 = A
    return `${letra}${a.col + 1}`;
  }

  getLetraFila(i: number) {
    return String.fromCharCode(65 + i);
  }

  get asientosSeleccionadosTexto() {
    return this.asientosSeleccionados
      .map((a) => this.formatearAsiento(a))
      .join(', ');
  }

  formatearHora(hora: string) {
    return hora.slice(0, 2) + ':' + hora.slice(2, 4);
  }
}
