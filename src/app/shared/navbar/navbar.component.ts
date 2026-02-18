import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})

export class NavbarComponent implements OnInit {

  usuarioLogueado: any = null;

  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  volver() {
    this.location.back();
  }
}
