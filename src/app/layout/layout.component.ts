import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { MobileNavComponent } from '../shared/mobile-nav/mobile-nav.component';
import { AurabotComponent } from '../shared/aurabot/aurabot.component';
import { UserService } from '../services/user.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    TranslatePipe,
    SidebarComponent,
    MobileNavComponent,
    AurabotComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  sidebarOpen    = signal(false);
  notifPanelOpen = signal(false);
  user  = inject(UserService);
  notifs = inject(NotificationsService);

  openSidebar():  void { this.sidebarOpen.set(true); }
  closeSidebar(): void { this.sidebarOpen.set(false); }
  toggleNotif():  void { this.notifPanelOpen.update(v => !v); }

  markRead(id: number):  void { this.notifs.markRead(id); }
  markAllRead():          void { this.notifs.markAllRead(); }
}
