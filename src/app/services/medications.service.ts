import { Injectable, signal } from '@angular/core';

export interface Medication {
  id: number;
  name: string;
  dose: string;
  freq: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class MedicationsService {
  medications = signal<Medication[]>([
    { id: 1, name: 'Metformina', dose: '500mg', freq: '2 veces al día', done: false },
    { id: 2, name: 'Losartán',   dose: '50mg',  freq: '1 vez al día',   done: false },
    { id: 3, name: 'Omeprazol',  dose: '20mg',  freq: 'Antes de comer', done: true  },
  ]);

  private nextId = 4;

  add(name: string, dose: string, freq: string) {
    this.medications.update(list => [...list, { id: this.nextId++, name, dose, freq, done: false }]);
  }

  toggle(id: number) {
    this.medications.update(list => list.map(m => m.id === id ? { ...m, done: !m.done } : m));
  }

  remove(id: number) {
    this.medications.update(list => list.filter(m => m.id !== id));
  }

  get doneCount(): number { return this.medications().filter(m => m.done).length; }
  get totalCount(): number { return this.medications().length; }
  get pct(): number { return this.totalCount === 0 ? 0 : Math.round((this.doneCount / this.totalCount) * 100); }
}
