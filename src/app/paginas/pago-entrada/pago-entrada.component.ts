/* Imports necesarios para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PagoService } from '../../servicios/pago.service';
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
  datos: PagoService['datosCompra'] = null;
  formulario: any;
  asientosFormateados: string[] = [];

  constructor(
    private pagoService: PagoService,
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
    
    this.datos = this.pagoService.datosCompra;

    if (!this.datos) {
      this.router.navigate(['/cartelera']);
      return;
    }

    this.asientosFormateados = this.datos.asientos.map(a =>
      this.convertirAsiento(a),
    );
  }

  convertirAsiento( asiento: { fila: number; col: number }) {
    const letra = String.fromCharCode(65 + asiento.fila);
    const numero = asiento.col + 1;
    return `${letra}${numero}`;
  }

  confirmarPago() {
    if (this.formulario.invalid) return;

    /* Para luego. */
    this.router.navigate(['/confirmacion']);
  }
}
