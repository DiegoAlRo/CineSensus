/* Imports necesarios para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SesionesService } from '../../servicios/sesiones.service';
import { Sesion } from '../../modelos/sesion';
import { Sala } from '../../modelos/sala';
import { MapAsientosPipe } from '../../pipes/map-asientos.pipe';
import { ReservasService } from '../../servicios/reservas.service';

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
  asientosSeleccionados: { fila: number; columna: number }[] = [];

  /* Se inyectan los servicios necesarios para obtener la sesión y sus datos relacionados. */
  constructor(
    private route: ActivatedRoute,
    private sesionesService: SesionesService,
    private reservasService: ReservasService,
    private router: Router,
  ) {}

  /* Al iniciar el componente, se obtiene el ID de la sesión desde la ruta y se carga la sesión correspondiente. */
  ngOnInit() {
    const idSesion = this.route.snapshot.paramMap.get('idSesion');

    if (!idSesion) return;

    this.sesionesService.getSesionPorId(idSesion).subscribe((sesion) => {
      this.sesion = sesion;
      this.sala = sesion.sala;
      this.generarMatrizDeAsientos();
    });
  }

  /* Getter para obtener la fecha de la sesión en formato largo, por ejemplo: "Lunes, 1 de Enero de 2024". */
  get fechaLargaSesion(): string {
    if (!this.sesion?.fecha) return '';

    const fecha = new Date(this.sesion.fecha);

    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    let texto = fecha.toLocaleDateString('es-ES', opciones);

    texto = texto.charAt(0).toUpperCase() + texto.slice(1);

    return texto;
  }

  /* Método para generar una matriz de asientos teniendo en cuenta los libres y los asientos ocupados. */
  generarMatrizDeAsientos() {

    this.matrizAsientos = [];

    for (let fila = 0; fila < this.sala.filas; fila++) {
      const filaAsientos = [];
      for (let columna = 0; columna < this.sala.columnas; columna++) {
        filaAsientos.push({
          fila,
          columna,
          ocupado: this.sesion.asientosOcupados.some(
            (a) => a.fila === fila && a.columna === columna,
          ),
          seleccionado: false,
        });
      }
      this.matrizAsientos.push(filaAsientos);
    }
  }

  /* Método para alternar la selección de un asiento, agregándolo o quitándolo de la lista de asientos seleccionados. */
  toggleAsiento(asiento: any, fila: number, columna: number) {
    if (asiento.ocupado) return;

    asiento.seleccionado = !asiento.seleccionado;

    if (asiento.seleccionado) {
      this.asientosSeleccionados = [
        ...this.asientosSeleccionados,
        { fila, columna },
      ];
    } else {
      this.asientosSeleccionados = this.asientosSeleccionados.filter(
        (a) => !(a.fila === fila && a.columna === columna),
      );
    }
  }

  /* Método para formatear un asiento en formato "A1", "B3", etc. a partir de su fila y columna. */
  formatearAsiento(a: { fila: number; columna: number }) {
    const letra = String.fromCharCode(65 + a.fila); // 65 = A
    return `${letra}${a.columna + 1}`;
  }

  /* Método para obtener la letra de una fila a partir de su índice, 0 -> A, 1 -> B, etc. */
  getLetraFila(i: number) {
    return String.fromCharCode(65 + i);
  }

  /* Getter para obtener un texto con los asientos seleccionados formateados, por ejemplo: "A1, A2, B3". */
  get asientosSeleccionadosTexto() {
    return this.asientosSeleccionados
      .map((a) => this.formatearAsiento(a))
      .join(', ');
  }

  /* Método para formatear una hora en formato "HHMM" a "HH:MM". */
  formatearHora(hora: string) {
    return hora.slice(0, 2) + ':' + hora.slice(2, 4);
  }

  /* Con este método el usuario será enviado al pago de la reserva. */
  irAPago() {
    this.reservasService.datosCompra = {
      sesion: this.sesion,
      asientos: this.asientosSeleccionados,
      total: this.asientosSeleccionados.length * this.sesion.precio,
    };

    /* Se navega a la página de pago. */
    this.router.navigate(['/pago-entrada']);
  }
}
