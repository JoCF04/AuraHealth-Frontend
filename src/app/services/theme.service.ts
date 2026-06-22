import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(false);
  fontSize = signal(16);

  constructor() {
    this.isDark.set(localStorage.getItem('aura_dark') === '1');
    this.fontSize.set(parseInt(localStorage.getItem('aura_font') || '16', 10));
    this.applyDark(this.isDark());
    document.documentElement.style.setProperty('--font-size', this.fontSize() + 'px');
  }

  applyDark(on: boolean) {
    document.body.classList.toggle('dark', on);
    this.isDark.set(on);
    localStorage.setItem('aura_dark', on ? '1' : '0');
  }

  toggleDark() { this.applyDark(!this.isDark()); }

  increaseFontSize() {
    const s = Math.min(this.fontSize() + 2, 22);
    this.fontSize.set(s);
    document.documentElement.style.setProperty('--font-size', s + 'px');
    localStorage.setItem('aura_font', String(s));
  }

  decreaseFontSize() {
    const s = Math.max(this.fontSize() - 2, 12);
    this.fontSize.set(s);
    document.documentElement.style.setProperty('--font-size', s + 'px');
    localStorage.setItem('aura_font', String(s));
  }
}
