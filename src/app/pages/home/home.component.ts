import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private io?: IntersectionObserver;
  mobileMenuOpen = false;
  currentSlide = 0;
  private carouselInterval: any;

  heroSlides = [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1600&auto=format&fit=crop&q=80'
  ];

  ngOnInit() {
    this.carouselInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    }, 5000);
  }

  ngAfterViewInit(): void {
    const els = this.host.nativeElement.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el: Element) => el.classList.add('is-visible'));
      return;
    }
    this.io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); this.io?.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach((el: Element) => this.io!.observe(el));
  }

  ngOnDestroy() {
    clearInterval(this.carouselInterval);
    this.io?.disconnect();
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.mobileMenuOpen = false;
  }
}
