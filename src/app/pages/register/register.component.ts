import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private translate = inject(TranslateService);

  nombre = ''; apellido = ''; fechaNac = ''; email = '';
  sexo = 'masculino'; password = ''; confirmPw = '';
  terms = false;
  showPw = false; showConfirm = false;
  strengthScore = 0;
  strengthLabel = '';
  strengthColors = ['#ef4444','#f97316','#eab308','#22c55e'];
  strengthKeys = ['register.muy_debil','register.debil','register.moderada','register.fuerte'];
  matchHint = '';
  matchClass = '';
  sending = false;

  constructor(private router: Router) {}

  onPasswordInput() {
    const v = this.password;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    this.strengthScore = score;
    const key = this.strengthKeys[score - 1] || 'register.muy_debil';
    this.strengthLabel = v ? this.translate.instant('register.fortaleza') + ' ' + this.translate.instant(key) : '';
    this.checkMatch();
  }

  checkMatch() {
    if (!this.confirmPw) { this.matchHint = ''; this.matchClass = ''; return; }
    if (this.password === this.confirmPw) {
      this.matchHint = this.translate.instant('register.coinciden');
      this.matchClass = 'match-ok';
    } else {
      this.matchHint = this.translate.instant('register.no_coinciden');
      this.matchClass = 'match-err';
    }
  }

  getSegColor(i: number): string {
    if (!this.password || i > this.strengthScore) return '#e2e8f0';
    return this.strengthColors[this.strengthScore - 1];
  }

  submit() {
    if (this.password !== this.confirmPw) {
      this.matchHint = this.translate.instant('register.no_coinciden'); this.matchClass = 'match-err'; return;
    }
    if (!this.terms) { alert(this.translate.instant('register.error_terms')); return; }
    this.sending = true;
    setTimeout(() => this.router.navigate(['/app/dashboard']), 1500);
  }
}
