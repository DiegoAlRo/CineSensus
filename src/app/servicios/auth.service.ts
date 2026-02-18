import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private usuarioSubject = new BehaviorSubject<any>(null);

  usuario$ = this.usuarioSubject.asObservable();

  constructor() {

    const data = localStorage.getItem('usuario');

    if (data) {
      this.usuarioSubject.next(JSON.parse(data));
    }

  }

  login(usuario: any) {

    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);

  }

  logout() {

    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    
  }
}
