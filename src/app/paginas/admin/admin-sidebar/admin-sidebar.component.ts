import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'],
})
export class AdminSidebarComponent {
  constructor(private router: Router) {}

  cambiarRuta(event: Event) {
    const select = event.target as HTMLSelectElement;
    const ruta = select.value;
    this.router.navigate([ruta]);
  }
}
