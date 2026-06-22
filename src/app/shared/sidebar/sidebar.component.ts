import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() isOpen = false;
  theme     = inject(ThemeService);
  translate = inject(TranslateService);

  setLang(lang: 'es' | 'en'): void {
    this.translate.use(lang);
  }

  isLang(lang: string): boolean {
    return (this.translate.currentLang() ?? this.translate.getFallbackLang()) === lang;
  }
}
