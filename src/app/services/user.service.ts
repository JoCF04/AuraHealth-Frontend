import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  initials = signal('JS');
  fullName = signal('Jake Smith');

  constructor() {
    const savedInitials = localStorage.getItem('aura_initials');
    const savedName = localStorage.getItem('aura_name');
    if (savedInitials) this.initials.set(savedInitials);
    if (savedName) this.fullName.set(savedName);
  }

  setUser(nombre: string, apellido: string) {
    const name = `${nombre} ${apellido}`.trim();
    const ini = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    this.fullName.set(name);
    this.initials.set(ini);
    localStorage.setItem('aura_name', name);
    localStorage.setItem('aura_initials', ini);
  }
}
