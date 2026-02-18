import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; 
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  
  mostrarNavbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
    
       this.mostrarNavbar = event.url !== '/';
       
      }
    });
  }

  ngOnInit(): void {
  localStorage.removeItem('usuario');
  }
}
