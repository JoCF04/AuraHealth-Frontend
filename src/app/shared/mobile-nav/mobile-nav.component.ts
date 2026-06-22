import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './mobile-nav.component.html',
})
export class MobileNavComponent {}
