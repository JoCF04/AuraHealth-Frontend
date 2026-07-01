import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RemindersService, Reminder, TAG_MAP } from '../../services/reminders.service';

interface CalDay { day: number; empty: boolean; isToday: boolean; hasEvent: boolean; isSelected: boolean; dateStr: string; }

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.css']
})
export class RecordatoriosComponent implements AfterViewInit, OnDestroy {
  svc = inject(RemindersService);
  private translate = inject(TranslateService);
  private langSub!: Subscription;
  tagMap = TAG_MAP;
  showModal = false;
  editingId: number | null = null;
  selectedDate: string | null = null;
  calDate = new Date();
  calMonthLabel = '';
  calDays: CalDay[] = [];
  diasSemana: string[] = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  rName = ''; rType = 'medical'; rDate = ''; rTime = '';

  ngAfterViewInit() {
    this.renderCalendar();
    this.buildDonut();
    this.langSub = this.translate.onLangChange.subscribe(() => this.renderCalendar());
  }

  ngOnDestroy() { this.langSub?.unsubscribe(); }

  get filtered() {
    let list = [...this.svc.reminders()].sort((a,b) => (a.dateStr+a.timeStr).localeCompare(b.dateStr+b.timeStr));
    if (this.selectedDate) list = list.filter(r => r.dateStr === this.selectedDate);
    return list;
  }

  fmt(r: Reminder): string {
    const d = new Date(r.dateStr + 'T' + r.timeStr);
    return d.toLocaleDateString('es-PE',{day:'numeric',month:'long'}) + ', ' + d.toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'});
  }

  toggle(id: number)  { this.svc.toggle(id); this.buildDonut(); }
  remove(id: number)  { this.svc.remove(id); this.renderCalendar(); this.buildDonut(); }

  openNew() {
    this.editingId = null; this.rName = ''; this.rType = 'medical'; this.rDate = ''; this.rTime = '';
    this.showModal = true;
  }

  openEdit(r: Reminder) {
    this.editingId = r.id; this.rName = r.name; this.rType = r.type; this.rDate = r.dateStr; this.rTime = r.timeStr;
    this.showModal = true;
  }

  save() {
    if (!this.rName.trim() || !this.rDate || !this.rTime) return;
    if (this.editingId !== null) this.svc.update(this.editingId, this.rName, this.rType, this.rDate, this.rTime);
    else this.svc.add(this.rName, this.rType, this.rDate, this.rTime);
    this.showModal = false; this.renderCalendar(); this.buildDonut();
  }

  prevMonth() { this.calDate.setMonth(this.calDate.getMonth()-1); this.renderCalendar(); }
  nextMonth() { this.calDate.setMonth(this.calDate.getMonth()+1); this.renderCalendar(); }

  renderCalendar() {
    const y = this.calDate.getFullYear(), m = this.calDate.getMonth();
    const today = new Date();
    const months: string[] = this.translate.instant('recordatorios.meses');
    this.calMonthLabel = `${months[m]}, ${y}`;
    const dias = this.translate.instant('recordatorios.dias_semana');
    if (Array.isArray(dias)) this.diasSemana = dias;
    const eventDays = this.svc.getEventDaysForMonth(y, m);
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m+1, 0).getDate();
    const startOffset = (firstDay + 6) % 7;
    const days: CalDay[] = [];
    for (let i = 0; i < startOffset; i++) days.push({ day:0, empty:true, isToday:false, hasEvent:false, isSelected:false, dateStr:'' });
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      days.push({ day:d, empty:false, isToday: d===today.getDate() && m===today.getMonth() && y===today.getFullYear(), hasEvent: eventDays.has(d), isSelected: this.selectedDate===ds, dateStr:ds });
    }
    this.calDays = days;
  }

  selectDay(cell: CalDay) {
    if (cell.empty) return;
    if (this.selectedDate === cell.dateStr) { this.selectedDate = null; }
    else { this.selectedDate = cell.dateStr; }
    this.renderCalendar();
  }

  buildDonut() {
    const svg = document.getElementById('donutProgress') as unknown as SVGElement;
    if (!svg) return;
    const pct = this.svc.pct;
    const r = 62, circ = 2*Math.PI*r, fill = circ*(pct/100);
    svg.setAttribute('viewBox','0 0 160 160');
    svg.innerHTML = `<circle cx="80" cy="80" r="${r}" fill="none" stroke="var(--turquoise-light)" stroke-width="14"/>
      <circle cx="80" cy="80" r="${r}" fill="none" stroke="url(#pg)" stroke-width="14" stroke-dasharray="${fill} ${circ}" stroke-linecap="round" style="transition:stroke-dasharray .8s ease"/>
      <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4db8c8"/><stop offset="100%" stop-color="#1a3a6e"/></linearGradient></defs>`;
  }
}
