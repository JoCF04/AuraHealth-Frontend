import { Component, inject, signal, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MedicationsService } from '../../services/medications.service';
import { UserService } from '../../services/user.service';

interface Activity {
  curr: number; goal: number; unit: string; label: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnInit, OnDestroy {
  translate = inject(TranslateService);
  meds      = inject(MedicationsService);
  user      = inject(UserService);

  medColors = ['#4db8c8', '#1a3a6e', '#22b573', '#f07030', '#9b59b6', '#e74c3c'];

  showMedModal = false;
  showActModal = false;
  mName = ''; mDose = ''; mFreq = '';

  activity: Record<string, Activity> = {
    pasos:    { curr: 6240,  goal: 10000, unit: 'pasos', label: 'Pasos'    },
    agua:     { curr: 1.4,   goal: 2.5,   unit: 'L',     label: 'Agua'     },
    sueño:    { curr: 6.5,   goal: 8,     unit: 'h',     label: 'Sueño'    },
    calorias: { curr: 1820,  goal: 2200,  unit: 'kcal',  label: 'Calorías' },
  };
  activityEntries = signal(Object.entries(this.activity));
  weekSteps = [5200, 8100, 6700, 9300, 7800, 6240, 0];
  days: string[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  editActKey  = '';
  editActCurr = 0;
  editActGoal = 0;

  private langSub!: Subscription;

  ngOnInit(): void {
    this.loadDays();
    this.langSub = this.translate.onLangChange.subscribe(() => this.loadDays());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  private loadDays(): void {
    this.translate.get('dashboard.actividad.dias').subscribe((d: unknown) => {
      if (Array.isArray(d)) this.days = d as string[];
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.buildDonut(), 100);
  }

  buildDonut(): void {
    const svg = document.getElementById('donutMeds') as unknown as SVGElement;
    if (!svg) return;
    const pct = this.meds.pct;
    const r = 62, circ = 2 * Math.PI * r, fill = circ * (pct / 100);
    svg.setAttribute('viewBox', '0 0 160 160');
    svg.innerHTML = `
      <circle cx="80" cy="80" r="${r}" fill="none" stroke="var(--turquoise-light)" stroke-width="14"/>
      <circle cx="80" cy="80" r="${r}" fill="none" stroke="url(#gd)" stroke-width="14"
        stroke-dasharray="${fill} ${circ}" stroke-linecap="round"
        style="transition:stroke-dasharray 1.2s ease"/>
      <defs>
        <linearGradient id="gd" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#4db8c8"/>
          <stop offset="100%" stop-color="#1a3a6e"/>
        </linearGradient>
      </defs>`;
  }

  toggleMed(id: number): void { this.meds.toggle(id); this.buildDonut(); }
  deleteMed(id: number): void { this.meds.remove(id); this.buildDonut(); }

  addMed(): void {
    if (!this.mName.trim()) return;
    this.meds.add(this.mName.trim(), this.mDose.trim(), this.mFreq.trim());
    this.mName = ''; this.mDose = ''; this.mFreq = '';
    this.showMedModal = false;
    this.buildDonut();
  }

  openActModal(key: string): void {
    this.editActKey  = key;
    this.editActCurr = this.activity[key].curr;
    this.editActGoal = this.activity[key].goal;
    this.showActModal = true;
  }

  saveActivity(): void {
    this.activity[this.editActKey].curr = this.editActCurr;
    this.activity[this.editActKey].goal = this.editActGoal;
    this.activityEntries.set(Object.entries(this.activity));
    if (this.editActKey === 'pasos') this.weekSteps[5] = this.editActCurr;
    this.showActModal = false;
  }

  actPct(a: Activity): number {
    return Math.min(100, Math.round((a.curr / a.goal) * 100));
  }

  maxWeek(): number { return Math.max(...this.weekSteps, 1); }
  barH(i: number):  string {
    return Math.max(Math.round((this.weekSteps[i] / this.maxWeek()) * 100), 3) + '%';
  }

  objectValues(obj: Record<string, Activity>) { return Object.values(obj); }
}
