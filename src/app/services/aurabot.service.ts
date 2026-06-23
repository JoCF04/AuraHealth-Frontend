import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AurabotService {
  private responses: Record<string, string | string[]> = {
    pastillas: 'Recuerda tomar tus pastillas con abundante agua y a la misma hora cada día.',
    vacuna:    'Las vacunas son esenciales para tu protección. Revisa tu calendario de vacunación en la sección de Recordatorios.',
    ejercicio: 'Se recomienda al menos 150 minutos de ejercicio moderado a la semana. ¡Tú puedes!',
    nutricion: 'Una dieta balanceada incluye frutas, verduras, proteínas y carbohidratos complejos.',
    cita:      'Para agendar una cita, ve a la sección de Recordatorios y presiona "Nuevo recordatorio".',
    default: [
      '¡Hola! Soy AuraBot, tu asistente de salud. ¿En qué puedo ayudarte hoy?',
      'Recuerda mantener una hidratación adecuada: al menos 8 vasos de agua al día.',
      'Para una mejor salud cardiovascular, te recomiendo 30 minutos de actividad física diaria.',
      'Asegúrate de tomar tus medicamentos a la hora indicada. ¡Tus recordatorios te ayudarán!',
      'Dormir entre 7 y 9 horas es fundamental para tu bienestar.',
    ]
  };

  getReply(text: string): string {
    const t = text.toLowerCase();
    if (t.includes('pastilla') || t.includes('medicamento')) return this.responses['pastillas'] as string;
    if (t.includes('vacuna'))    return this.responses['vacuna'] as string;
    if (t.includes('ejercicio') || t.includes('correr')) return this.responses['ejercicio'] as string;
    if (t.includes('nutrici') || t.includes('comer') || t.includes('dieta')) return this.responses['nutricion'] as string;
    if (t.includes('cita') || t.includes('médico') || t.includes('doctor')) return this.responses['cita'] as string;
    const defaults = this.responses['default'] as string[];
    return defaults[Math.floor(Math.random() * defaults.length)];
  }
}
