import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PartnerService, Partner } from '../../../../../../front/2_Lucia_landing_partner_aurabot/src/app/services/partner.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements AfterViewInit {
  svc = inject(PartnerService);
  notifs = inject(NotificationsService);
  private translate = inject(TranslateService);
  partnerInput = '';
  showModal = false;
  selectedPreset = '';
  customMsg = '';
  toastMsg = '';
  toastVisible = false;

  presetKeys = ['p1','p2','p3','p4','p5','p6'];

  ngAfterViewInit() { if (this.svc.currentPartner()) this.buildDonut(); }

  get partner(): Partner | null { return this.svc.currentPartner(); }

  connect() {
    const val = this.partnerInput.trim();
    if (!val) return;
    this.svc.connect(val);
    this.partnerInput = '';
    setTimeout(() => this.buildDonut(), 100);
  }

  connectDemo(email: string) { this.svc.connect(email); setTimeout(() => this.buildDonut(), 100); }

  disconnect() { this.svc.disconnect(); }

  medPct(p: Partner): number {
    const t = p.meds.length; if (!t) return 0;
    return Math.round((p.meds.filter(m => m.done).length / t) * 100);
  }

  actAvg(p: Partner): number {
    const vals = Object.values(p.activity);
    return Math.round(vals.reduce((s, a) => s + Math.min(100, (a.curr/a.goal)*100), 0) / vals.length);
  }

  actPct(curr: number, goal: number): number { return Math.min(100, Math.round((curr/goal)*100)); }

  actColor(curr: number, goal: number): string {
    const p = this.actPct(curr,goal);
    return p >= 80 ? '#22b573' : p >= 50 ? 'var(--turquoise)' : '#f07030';
  }

  buildDonut() {
    const p = this.partner; if (!p) return;
    const pct = this.medPct(p);
    const svg = document.getElementById('ptnDonut') as unknown as SVGElement;
    if (!svg) return;
    const r=62, circ=2*Math.PI*r, fill=circ*(pct/100);
    svg.setAttribute('viewBox','0 0 160 160');
    svg.innerHTML = `<circle cx="80" cy="80" r="${r}" fill="none" stroke="var(--turquoise-light)" stroke-width="14"/>
      <circle cx="80" cy="80" r="${r}" fill="none" stroke="url(#ptg)" stroke-width="14" stroke-dasharray="${fill} ${circ}" stroke-linecap="round" style="transition:stroke-dasharray 1.2s ease"/>
      <defs><linearGradient id="ptg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4db8c8"/><stop offset="100%" stop-color="#1a3a6e"/></linearGradient></defs>`;
  }

  openModal() { this.selectedPreset = ''; this.customMsg = ''; this.showModal = true; }
  closeModal() { this.showModal = false; }
  selectPreset(key: string) { this.selectedPreset = key; }

  send() {
    const presetMsg = this.selectedPreset
      ? this.translate.instant('partner.' + this.selectedPreset + '_msg')
      : '';
    const msg = this.customMsg.trim() || presetMsg;
    if (!msg) return;
    this.closeModal();
    const name = this.partner?.name || '';
    this.notifs.add({ icon:'', title:`${this.translate.instant('partner.toast_enviado')} ${name}`, body: msg.length > 55 ? msg.slice(0,55)+'…' : msg, time:'Ahora' });
    this.showToast(`${this.translate.instant('partner.toast_enviado')} ${name}`);
  }

  showToast(msg: string) {
    this.toastMsg = msg; this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 2800);
  }

  medColors = ['#4db8c8','#1a3a6e','#22b573','#f07030','#9b59b6'];
  activityValues(p: Partner) { return Object.values(p.activity); }
  partnerMedsDone(p: Partner): number { return p.meds.filter(m => m.done).length; }
  partnerRemindersPending(p: Partner): number { return p.reminders.filter(r => !r.done).length; }
}
