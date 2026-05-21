/* Imports necesarios para el componente. */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../servicios/reservas.service';
import { Reserva } from '../../modelos/reserva';
import { ToastService } from '../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-entrada',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css'],
})

/* Esta es la clase del componente de la entrada a una reserva. */
export class EntradaComponent implements OnInit {
  reserva: Reserva | null = null;
  cargando = true;

  /* Constructor del componente. */
  constructor(
    private route: ActivatedRoute,
    private reservasService: ReservasService,
    private toastService: ToastService,
    public router: Router,
  ) {}

  ngOnInit() {

    /* Se obtendrá el id mediante la url. */
    const id = this.route.snapshot.paramMap.get('id');

    /* De no encontrarse el id, se le redigirá al usuario hacia perfil. */
    if (!id) {
      this.router.navigate(['/perfil']);
      return;
    }

    /* La reserva de la entrada se obtendrá mediante el id. */
    this.reservasService.getReservaPorId(id).subscribe({
      next: (res) => {
        this.reserva = res;
        this.cargando = false;

        /* Se comprobará el estado de la reserva para evitar mostrar una entrada cancelada. */
        if (this.reserva.estado === 'cancelada') {
          this.toastService.show('Esta entrada está cancelada y no es válida', 'error');
          this.router.navigate(['/perfil']);
          return;
        }

        /* Se comprobará si la sesión o la sala de la reserva está disponible y se avisará al usuario de lo contrario. */
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

  /* Se formatearán los asientos. */
  formatearAsiento(a: { fila: number; columna: number }) {
    const letra = String.fromCharCode(65 + a.fila);
    const numero = a.columna + 1;
    return `${letra}${numero}`;
  }
}
