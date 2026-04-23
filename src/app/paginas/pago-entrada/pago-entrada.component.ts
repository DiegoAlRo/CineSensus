/* Imports necesarios para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ReservasService } from '../../servicios/reservas.service';
import { Router } from '@angular/router';

/* Componente para mostrar el formulario de pago de la entrada. */
@Component({
  selector: 'app-pago-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pago-entrada.component.html',
  styleUrls: ['./pago-entrada.component.css'],
})

/* La clase del componente, que implementa OnInit para cargar los datos al iniciar. */
export class PagoEntradaComponent implements OnInit {
  datos: ReservasService['datosCompra'] = null;
  formulario: any;
  asientosFormateados: string[] = [];

  /* El constructor inyecta el servicio de reservas, el form builder para crear el formulario y el router para redirigir. */
  constructor(
    private reservasService: ReservasService,
    private fb: FormBuilder,
    private router: Router,
  ) {

    /* Se crea el formulario con los campos necesarios y sus validaciones. */
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      caducidad: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  /* Al inciar el componente, se cargan los datos de la compra desde el servicio y si no hay datos, se redirige a la cartelera. */
  ngOnInit() {
    this.datos = this.reservasService.datosCompra;

    if (!this.datos) {
      this.router.navigate(['/cartelera']);
      return;
    }

    this.asientosFormateados = this.datos.asientos.map((a) =>
      this.convertirAsiento(a),
    );
  }

  /* Método para cambiar el formato de fila/columna a formato letra/número. */
  convertirAsiento(asiento: { fila: number; columna: number }) {
    const letra = String.fromCharCode(65 + asiento.fila);
    const numero = asiento.columna + 1;
    return `${letra}${numero}`;
  }

  /* Método para confirmar el pago teniendo en cuenta los datos del formulario. */
  confirmarPago() {

    if (this.formulario.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    if (!usuario) {
      console.error('No hay usuario logueado');
      return;
    }

    const usuarioId = usuario.id;

    /* Se preparan los datos para crear la reserva. */
    const datos = {
      usuarioId,
      sesionId: this.datos!.sesion.id,
      asientos: this.datos!.asientos.map((a) => ({
        fila: a.fila,
        columna: a.columna,
      })),
      total: this.datos!.total,
    };

    /* Se llama al servicio para crear la reserva y se maneja la respuesta. */
    this.reservasService.crearReserva(datos).subscribe({
      next: (reserva) => {
        this.reservasService.reservaActual = reserva;
        this.router.navigate(['/muestra-compra']);
      },
      error: (err) => {
        console.error('Error al crear reserva:', err);
      },
    });
  }
}
