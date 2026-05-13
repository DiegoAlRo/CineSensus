import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../servicios/reservas.service';
import { Reserva } from '../../modelos/reserva';
import { ToastService } from '../../servicios/toast.service';

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
    private toastService: ToastService,
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

        if (this.reserva.estado === 'cancelada') {
          this.toastService.show('Esta entrada está cancelada y no es válida', 'error');
          this.router.navigate(['/perfil']);
          return;
        }

        if (!this.reserva.sesion) {
          this.toastService.show('La sesión de esta entrada no está disponible', 'error');
          this.router.navigate(['/perfil']);
          return;
        }

        if (!this.reserva.sesion.sala) {
          this.toastService.show('La sala de esta entrada no está disponible', 'error');
          this.router.navigate(['/perfil']);
          return;
        }
      },
      error: () => {
        this.toastService.show('Error al cargar la entrada', 'error');
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
