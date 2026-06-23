import { Injectable, signal } from '@angular/core';

export interface PartnerActivity {
  curr: number; goal: number; unit: string; label: string;
}

export interface PartnerReminder {
  name: string; time: string; done: boolean;
}

export interface PartnerMed {
  id: number; name: string; freq: string; done: boolean;
}

export interface Partner {
  name: string;
  initials: string;
  email: string;
  lastSeen: string;
  meds: PartnerMed[];
  activity: Record<string, PartnerActivity>;
  reminders: PartnerReminder[];
}

const DEMO_PARTNERS: Record<string, Partner> = {
  'ana.garcia@email.com': {
    name: 'Ana García', initials: 'AG', email: 'ana.garcia@email.com', lastSeen: 'Hace 2h',
    meds: [
      { id: 1, name: 'Metformina 500mg',  freq: '2x día',         done: true  },
      { id: 2, name: 'Vitamina D 1000UI', freq: '1x día',         done: true  },
      { id: 3, name: 'Omeprazol 20mg',    freq: 'Antes de comer', done: false },
    ],
    activity: {
      pasos:    { curr: 7200, goal: 10000, unit: 'pasos', label: 'Pasos'    },
      agua:     { curr: 1.8,  goal: 2.5,   unit: 'L',     label: 'Agua'     },
      sueño:    { curr: 7,    goal: 8,     unit: 'h',     label: 'Sueño'    },
      calorias: { curr: 1650, goal: 2200,  unit: 'kcal',  label: 'Calorías' },
    },
    reminders: [
      { name: 'Chequeo médico anual',  time: '9:00 AM', done: true  },
      { name: 'Pastillas – Omeprazol', time: '8:00 PM', done: false },
    ],
  },
  'carlos.lopez@email.com': {
    name: 'Carlos López', initials: 'CL', email: 'carlos.lopez@email.com', lastSeen: 'Hace 45 min',
    meds: [
      { id: 1, name: 'Losartán 50mg',  freq: '1x día', done: true  },
      { id: 2, name: 'Aspirina 100mg', freq: '1x día', done: false },
    ],
    activity: {
      pasos:    { curr: 4500, goal: 8000, unit: 'pasos', label: 'Pasos'    },
      agua:     { curr: 1.2,  goal: 2.0,  unit: 'L',     label: 'Agua'     },
      sueño:    { curr: 5.5,  goal: 8,    unit: 'h',     label: 'Sueño'    },
      calorias: { curr: 2100, goal: 2500, unit: 'kcal',  label: 'Calorías' },
    },
    reminders: [
      { name: 'Control de presión', time: '10:00 AM', done: false },
      { name: 'Aspirina 100mg',     time: '9:00 PM',  done: false },
    ],
  },
};

@Injectable({ providedIn: 'root' })
export class PartnerService {
  currentPartner = signal<Partner | null>(null);

  constructor() {
    const saved = localStorage.getItem('aura_partner');
    if (saved) {
      try { this.currentPartner.set(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }

  connect(emailOrId: string) {
    const key = emailOrId.toLowerCase().trim();
    const data = DEMO_PARTNERS[key];
    const partner: Partner = data
      ? { ...data }
      : {
          name: 'María Rodríguez (' + emailOrId + ')', initials: 'MR', email: emailOrId, lastSeen: 'Hace 30 min',
          meds: [
            { id: 1, name: 'Enalapril 5mg',    freq: '2x día', done: true  },
            { id: 2, name: 'Metformina 850mg', freq: '1x día', done: false },
          ],
          activity: {
            pasos:    { curr: 5800, goal: 10000, unit: 'pasos', label: 'Pasos'    },
            agua:     { curr: 2.1,  goal: 2.5,   unit: 'L',     label: 'Agua'     },
            sueño:    { curr: 6.5,  goal: 8,     unit: 'h',     label: 'Sueño'    },
            calorias: { curr: 1900, goal: 2000,  unit: 'kcal',  label: 'Calorías' },
          },
          reminders: [
            { name: 'Medicamentos – Enalapril', time: '8:00 AM', done: true  },
            { name: 'Metformina 850mg',         time: '9:00 PM', done: false },
          ],
        };
    this.currentPartner.set(partner);
    localStorage.setItem('aura_partner', JSON.stringify(partner));
  }

  disconnect() {
    this.currentPartner.set(null);
    localStorage.removeItem('aura_partner');
  }
}
