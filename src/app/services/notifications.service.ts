import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  read: boolean;
  icon: string;
  title: string;
  body: string;
  time: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  notifications = signal<Notification[]>([
    { id: 1, read: false, icon: '', title: 'Chequeo médico mañana',  body: 'Dr. Ramírez – 8:00 AM',              time: 'Hace 5 min'  },
    { id: 2, read: false, icon: '', title: 'Hora de tu Omeprazol',   body: 'Recuerda tomarlo antes de comer',     time: 'Hace 20 min' },
    { id: 3, read: false, icon: '', title: 'Meta de pasos al 62%',   body: 'Te faltan 3,760 pasos para hoy',      time: 'Hace 1 h'    },
    { id: 4, read: true,  icon: '', title: 'Cita confirmada',        body: 'Dr. Ramírez confirmó para el 15 May', time: 'Ayer'        },
    { id: 5, read: true,  icon: '', title: 'Hidratación baja',       body: 'Registra más agua hoy',               time: 'Ayer'        },
  ]);

  add(notif: Partial<Notification>) {
    this.notifications.update(list => [{
      id: Date.now(), read: false,
      icon: notif.icon || '', title: notif.title || 'Nueva notificación',
      body: notif.body || '', time: notif.time || 'Ahora'
    }, ...list]);
  }

  markRead(id: number) {
    this.notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
  }

  markAllRead() {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  get unreadCount(): number { return this.notifications().filter(n => !n.read).length; }
}
