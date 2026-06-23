import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AurabotService } from '../../services/aurabot.service';

export interface BotMessage {
  text: string;
  type: 'bot' | 'user';
}

@Component({
  selector: 'app-aurabot',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './aurabot.component.html'
})
export class AurabotComponent {
  private botService = inject(AurabotService);
  isOpen = signal(false);
  messages = signal<BotMessage[]>([
    { text: '¡Hola! Soy AuraBot, tu asistente de salud personal. ¿En qué puedo ayudarte hoy?', type: 'bot' }
  ]);
  inputText = '';
  suggestions = ['¿Qué pastillas tomar?', 'Consejo de ejercicio', 'Agendar cita'];

  toggle() { this.isOpen.update(v => !v); }
  close()  { this.isOpen.set(false); }

  send(text?: string) {
    const msg = (text ?? this.inputText).trim();
    if (!msg) return;
    this.messages.update(list => [...list, { text: msg, type: 'user' }]);
    this.inputText = '';
    setTimeout(() => {
      this.messages.update(list => [...list, { text: this.botService.getReply(msg), type: 'bot' }]);
    }, 600);
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') this.send();
  }
}
