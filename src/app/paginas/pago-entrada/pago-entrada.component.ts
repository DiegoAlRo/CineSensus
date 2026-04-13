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

  constructor(
    private reservasService: ReservasService,
    private fb: FormBuilder,
    private router: Router,
  ) {

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

  convertirAsiento(asiento: { fila: number; col: number }) {
    const letra = String.fromCharCode(65 + asiento.fila);
    const numero = asiento.col + 1;
    return `${letra}${numero}`;
  }

  confirmarPago() {
    debugger;
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

    const datos = {
      usuarioId,
      sesionId: this.datos!.sesion._id,
      asientos: this.datos!.asientos.map((a) => ({
        fila: a.fila,
        columna: a.col,
      })),
      total: this.datos!.total,
    };

    debugger
    console.log('Datos enviados:', datos);
    this.reservasService.crearReserva(datos).subscribe({
      next: (reserva) => {
        this.router.navigate(['/muestra-compra'], {
          state: { reserva },
        });
      },
      error: (err) => {
        console.error('Error al crear reserva:', err);
      },
    });
  }
}
