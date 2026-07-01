import { Injectable, signal } from '@angular/core';

export interface Reminder {
  id: number;
  name: string;
  type: 'medical' | 'medicine' | 'exam' | 'vaccine';
  dateStr: string;
  timeStr: string;
  done: boolean;
}

export const TAG_MAP: Record<string, { label: string; cls: string }> = {
  medical:  { label: 'Médico',    cls: 'tag-medical'  },
  medicine: { label: 'Pastillas', cls: 'tag-medicine' },
  exam:     { label: 'Examen',    cls: 'tag-exam'     },
  vaccine:  { label: 'Vacuna',    cls: 'tag-vaccine'  },
};

@Injectable({ providedIn: 'root' })
export class RemindersService {
  reminders = signal<Reminder[]>([
    { id: 1, name: 'Chequeo médico',          type: 'medical',  dateStr: '2026-05-10', timeStr: '08:00', done: false },
    { id: 2, name: 'Pastillas – Omeprazol',   type: 'medicine', dateStr: '2026-05-10', timeStr: '20:00', done: false },
    { id: 3, name: 'Exámenes de laboratorio', type: 'exam',     dateStr: '2026-05-15', timeStr: '06:30', done: false },
    { id: 4, name: 'Vacuna Influenza',        type: 'vaccine',  dateStr: '2026-05-17', timeStr: '10:00', done: false },
    { id: 5, name: 'Pastillas – Metformina',  type: 'medicine', dateStr: '2026-05-22', timeStr: '20:00', done: false },
  ]);

  private nextId = 6;

  add(name: string, type: string, dateStr: string, timeStr: string) {
    this.reminders.update(list => [...list, { id: this.nextId++, name, type: type as any, dateStr, timeStr, done: false }]);
  }

  update(id: number, name: string, type: string, dateStr: string, timeStr: string) {
    this.reminders.update(list => list.map(r => r.id === id ? { ...r, name, type: type as any, dateStr, timeStr } : r));
  }

  toggle(id: number) {
    this.reminders.update(list => list.map(r => r.id === id ? { ...r, done: !r.done } : r));
  }

  remove(id: number) {
    this.reminders.update(list => list.filter(r => r.id !== id));
  }

  getEventDaysForMonth(year: number, month: number): Set<number> {
    const days = new Set<number>();
    this.reminders().forEach(r => {
      const d = new Date(r.dateStr + 'T00:00:00');
      if (d.getFullYear() === year && d.getMonth() === month) days.add(d.getDate());
    });
    return days;
  }

  get doneCount(): number { return this.reminders().filter(r => r.done).length; }
  get totalCount(): number { return this.reminders().length; }
  get pct(): number { return this.totalCount === 0 ? 0 : Math.round((this.doneCount / this.totalCount) * 100); }
}
