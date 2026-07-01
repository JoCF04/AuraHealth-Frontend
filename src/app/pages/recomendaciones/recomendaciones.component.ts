import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface Article {
  img: string; cat: string; idx: number;
}

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './recomendaciones.component.html'
})
export class RecomendacionesComponent {
  private t = inject(TranslateService);
  activeFilter = signal('all');
  search = signal('');

  articles: Article[] = [
    { img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=140&fit=crop&auto=format', cat:'prevencion', idx:0 },
    { img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=140&fit=crop&auto=format', cat:'prevencion', idx:1 },
    { img:'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=140&fit=crop&auto=format', cat:'prevencion', idx:2 },
    { img:'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=140&fit=crop&auto=format', cat:'prevencion', idx:3 },
    { img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=140&fit=crop&auto=format', cat:'nutricion', idx:4 },
    { img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=140&fit=crop&auto=format', cat:'nutricion', idx:5 },
    { img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=140&fit=crop&auto=format', cat:'ejercicio', idx:6 },
    { img:'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=140&fit=crop&auto=format', cat:'ejercicio', idx:7 },
    { img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=140&fit=crop&auto=format', cat:'mental',    idx:8 },
    { img:'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=400&h=140&fit=crop&auto=format', cat:'mental',    idx:9 },
  ];

  filterKeys = ['all', 'nutricion', 'prevencion', 'ejercicio', 'mental'];

  private norm(s: string): string {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  get visible() {
    const f = this.activeFilter();
    const q = this.norm(this.search());
    return this.articles.filter(a => {
      const okCat = f === 'all' || a.cat === f;
      if (!okCat) return false;
      if (!q) return true;
      const titulo = this.norm(this.t.instant('recomendaciones.art.' + a.idx + '.titulo'));
      const desc   = this.norm(this.t.instant('recomendaciones.art.' + a.idx + '.desc'));
      return titulo.includes(q) || desc.includes(q);
    });
  }

  setFilter(key: string) { this.activeFilter.set(key); }

  tagClass(cat: string): string {
    return { nutricion:'rec-tag nutricion', prevencion:'rec-tag prevencion', ejercicio:'rec-tag ejercicio', mental:'rec-tag mental' }[cat] ?? 'rec-tag';
  }
}
