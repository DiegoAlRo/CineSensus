import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../servicios/reservas.service';
import { Reserva } from '../../modelos/reserva';

@Component({
  selector: 'app-entrada',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css'],
})
export class EntradaComponent implements OnInit {
  reserva: Reserva | null = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private reservasService: ReservasService,
    public router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/perfil']);
      return;
    }

    this.reservasService.getReservaPorId(id).subscribe({
      next: (res) => {
        this.reserva = res;
        this.cargando = false;
      },
      error: () => {
        this.router.navigate(['/perfil']);
      },
    });
  }

  formatearAsiento(a: { fila: number; columna: number }) {
    const letra = String.fromCharCode(65 + a.fila);
    const numero = a.columna + 1;
    return `${letra}${numero}`;
  }

}
