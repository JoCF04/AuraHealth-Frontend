import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { UserService } from '../../services/user.service';

interface ProfileMed { id: number; name: string; freq: string; }
interface HealthData { sangre: string; presion: string; glucosa: string; colesterol: string; alergias: string; }

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  theme = inject(ThemeService);
  userSvc = inject(UserService);
  private translate = inject(TranslateService);

  /* Profile form */
  pNombre = 'Jake'; pApellido = 'Smith';
  pEmail = 'jake.smith@email.com'; pTelefono = '+51 999 123 456';
  pNacimiento = '1997-03-15'; pSexo = 'masculino';
  pPeso = 75; pAltura = 178;
  pMedico = 'Dr. Ramírez – Clínica San Pablo';
  private savedProfile = { pNombre:'Jake', pApellido:'Smith', pEmail:'jake.smith@email.com', pTelefono:'+51 999 123 456', pNacimiento:'1997-03-15', pSexo:'masculino', pPeso:75, pAltura:178, pMedico:'Dr. Ramírez – Clínica San Pablo' };
  notifRecordatorios = signal(true);

  /* Computed hero values */
  heroAge = signal(28);
  heroPeso = signal('75 kg');
  heroAltura = signal('178 cm');
  heroImc = signal('23.7');

  /* Health data */
  healthData: HealthData = { sangre:'O+', presion:'120/80 mmHg', glucosa:'95 mg/dL', colesterol:'210 mg/dL', alergias:'Penicilina' };
  healthEdit: HealthData = { ...this.healthData };
  showHealthModal = false;
  showMedModal = false;
  pmName = ''; pmFreq = '';
  toastVisible = false;
  toastMsg = '';

  /* Profile medications */
  profColors = ['#4db8c8','#2155a3','#22b573','#f07030','#9b59b6','#e74c3c'];
  profileMeds = signal<ProfileMed[]>([
    { id:1, name:'Metformina 500mg',  freq:'2 veces al día – con alimentos' },
    { id:2, name:'Losartán 50mg',     freq:'1 vez al día – mañana'          },
    { id:3, name:'Vitamina D 1000UI', freq:'1 vez al día – con desayuno'    },
    { id:4, name:'Omeprazol 20mg',    freq:'1 vez al día – antes de comer'  },
  ]);
  private nextMedId = 5;

  saveProfile() {
    this.userSvc.setUser(this.pNombre, this.pApellido);
    const nacStr = this.pNacimiento;
    if (nacStr) {
      const today = new Date(), bday = new Date(nacStr + 'T00:00:00');
      let age = today.getFullYear() - bday.getFullYear();
      const m = today.getMonth() - bday.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) age--;
      this.heroAge.set(age);
    }
    if (!isNaN(this.pPeso))   this.heroPeso.set(this.pPeso + ' kg');
    if (!isNaN(this.pAltura)) this.heroAltura.set(this.pAltura + ' cm');
    if (!isNaN(this.pPeso) && !isNaN(this.pAltura) && this.pAltura > 0)
      this.heroImc.set((this.pPeso / Math.pow(this.pAltura / 100, 2)).toFixed(1));
    this.savedProfile = { pNombre: this.pNombre, pApellido: this.pApellido, pEmail: this.pEmail, pTelefono: this.pTelefono, pNacimiento: this.pNacimiento, pSexo: this.pSexo, pPeso: this.pPeso, pAltura: this.pAltura, pMedico: this.pMedico };
    this.toast(this.translate.instant('perfil.toast_guardado'));
  }

  scrollToEdit() { document.getElementById('editar-info')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  cancelEdit() {
    const s = this.savedProfile;
    this.pNombre = s.pNombre; this.pApellido = s.pApellido;
    this.pEmail = s.pEmail; this.pTelefono = s.pTelefono;
    this.pNacimiento = s.pNacimiento; this.pSexo = s.pSexo;
    this.pPeso = s.pPeso; this.pAltura = s.pAltura;
    this.pMedico = s.pMedico;
  }

  openHealthModal() { this.healthEdit = { ...this.healthData }; this.showHealthModal = true; }
  closeHealthModal() { this.showHealthModal = false; }
  saveHealth() { this.healthData = { ...this.healthEdit }; this.closeHealthModal(); this.toast(this.translate.instant('perfil.toast_salud')); }

  openMedModal()  { this.pmName = ''; this.pmFreq = ''; this.showMedModal = true; }
  closeMedModal() { this.showMedModal = false; }
  addMed() {
    if (!this.pmName.trim()) return;
    this.profileMeds.update(list => [...list, { id: this.nextMedId++, name: this.pmName.trim(), freq: this.pmFreq.trim() || '–' }]);
    this.closeMedModal();
  }
  deleteMed(id: number) { this.profileMeds.update(list => list.filter(m => m.id !== id)); }

  toast(msg: string) {
    this.toastMsg = msg; this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 2500);
  }
}
