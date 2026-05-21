/* Imports necesarios para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReservasService } from '../../servicios/reservas.service';
import { Router } from '@angular/router';
import { ToastService } from '../../servicios/toast.service';

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

  /* propiedades del componente. */
  datos: ReservasService['datosCompra'] = null;
  formulario: any;
  asientosFormateados: string[] = [];

  /* El constructor inyecta el servicio de reservas, el form builder para crear el formulario y el router para redirigir. */
  constructor(
    private reservasService: ReservasService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
  ) {

    /* Se crea el formulario con los campos necesarios y sus validaciones. */
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      caducidad: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  /* Al inciar el componente, se cargan los datos de la compra desde el servicio y si no hay datos, se redirige a la cartelera. */
  ngOnInit() {

    /* Se reciben los datos almacenados desde la anterior página. */
    this.datos = this.reservasService.datosCompra;

    /* De no llegar aquí con los asientos marcados, se le redirigirá. */
    if (!this.datos) {
      this.router.navigate(['/cartelera']);
      return;
    }

    /* De no encontrarse la sesión o la sala, se le avisará al usuario. */
    if (!this.datos.sesion) {
      this.toastService.show('La sesión ya no está disponible', 'error');
      this.router.navigate(['/cartelera']);
      return;
    }

    if (!this.datos.sesion.sala) {
      this.toastService.show('La sala ya no existe', 'error');
      this.router.navigate(['/cartelera']);
      return;
    }

    /* Se le dará formato a cada asiento(A1, A2, A3...). */
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

    /* Se extraerá el usuario del localStorage. */
    const data = localStorage.getItem('usuario');

    /* Se comprobará que el usuario ha iniciado sesión. */
    if (!data) {
      this.toastService.show('Debes iniciar sesión para completar la compra', 'error');
      this.router.navigate(['/login']);
      return;
    }

    /* Si el formulario posee datos inválidos, se avisará al usuario. */
    if (this.formulario.invalid) {
      console.log('Formulario Inválido');
      this.toastService.show('Formulario inválido', 'error');
      return;
    }

    const usuario = JSON.parse(data);
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

    const fechaSesion = new Date(
      `${this.datos!.sesion.fecha}T${this.datos!.sesion.hora.slice(0, 2)}:${this.datos!.sesion.hora.slice(2, 4)}:00`,
    );

    /* Se evitará que el usuario reserve una sesión de una hora pasada. */
    if (fechaSesion < new Date()) {
      this.toastService.show('Esta sesión ya no se encuentra disponible', 'error');
      this.router.navigate(['/cartelera']);
      return;
    }

    /* Se llama al servicio para crear la reserva y se maneja la respuesta. */
    this.reservasService.crearReserva(datos).subscribe({
      next: (reserva) => {
        this.reservasService.reservaActual = reserva;
        this.router.navigate(['/muestra-compra']);
        this.toastService.show('Compra exitosa, disfruta de la película', 'exito');
      },
      error: (err) => {
        console.error('Error al crear reserva:', err);

        if (err.error?.error === 'La sesión ya ha pasado') {
          this.toastService.show('Esta sesión ya no se encuentra disponible', 'error');
          this.router.navigate(['/cartelera']);
          return;
        }

        this.toastService.show('Error al procesar el pago', 'error');
      },
    });
  }
}
