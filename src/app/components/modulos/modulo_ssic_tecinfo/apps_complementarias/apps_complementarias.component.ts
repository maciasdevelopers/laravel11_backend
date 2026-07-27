import { Component, OnInit, OnDestroy } from '@angular/core';
import { RelojChecadorService } from '../../../../servicios/ssic/reloj-checador.service';
import { Geolocation } from '@capacitor/geolocation';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-apps-com',
  templateUrl: './apps_complementarias.component.html',
  standalone: false,
  styleUrls: [
    '../../../../styles/explain.css',
    '../../../../styles/cards.css',
    '../../../../styles/buttons.css',
    './apps_complementarias.component.css'
  ]
})
export class AppsComplementariasComponent implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  timerId: any;
  userProfile: any;
  isClockedIn: boolean = false;
  isRemote: boolean = false;
  attendanceHistory: any[] = [];
  locationError: string | null = null;
  selectedFile: File | null = null;

  constructor(private relojService: RelojChecadorService) { }

  ngOnInit(): void {
    this.startClock();
    this.loadUserProfile();
    this.loadAttendanceHistory();
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  startClock() {
    this.timerId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  loadUserProfile() {
    this.relojService.getUserWorkProfile().subscribe(
      response => {
        if (response.status === 'success') {
          this.userProfile = response.profile;
          this.isRemote = this.userProfile.modalidad === 'Teletrabajo' || this.userProfile.modalidad === 'Remoto';
          this.isClockedIn = this.userProfile.esta_trabajando;
        }
      },
      error => console.error(error)
    );
  }

  loadAttendanceHistory() {
    this.relojService.getAttendanceHistory().subscribe(
      response => {
        if (response.status === 'success') {
          this.attendanceHistory = response.history;
        }
      },
      error => console.error(error)
    );
  }

  async onCheckIn() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      if (!this.isRemote && this.userProfile.centro_trabajo_lat && this.userProfile.centro_trabajo_lng) {
        const distance = this.calculateDistance(
          lat, lng,
          this.userProfile.centro_trabajo_lat,
          this.userProfile.centro_trabajo_lng
        );

        if (distance > 0.2) { // 200 meters
          this.locationError = `Estás a ${(distance * 1000).toFixed(0)}m del centro de trabajo. Debes estar a menos de 200m.`;
          return;
        }
      }

      this.relojService.checkIn({ latitude: lat, longitude: lng }).subscribe(
        response => {
          if (response.status === 'success') {
            this.isClockedIn = true;
            this.locationError = null;
            Swal.fire('Éxito', 'Entrada registrada correctamente', 'success');
            this.loadAttendanceHistory();
          }
        },
        error => Swal.fire('Error', error, 'error')
      );
    } catch (err) {
      this.locationError = 'No se pudo obtener la ubicación. Por favor, activa el GPS.';
      console.error(err);
    }
  }

  async onCheckOut() {
    if (this.isRemote && !this.selectedFile) {
      Swal.fire('Atención', 'Debes adjuntar una evidencia de trabajo para salir.', 'warning');
      return;
    }

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      if (!this.isRemote && this.userProfile.centro_trabajo_lat && this.userProfile.centro_trabajo_lng) {
        const distance = this.calculateDistance(
          lat, lng,
          this.userProfile.centro_trabajo_lat,
          this.userProfile.centro_trabajo_lng
        );

        if (distance > 0.2) { // 200 meters
          this.locationError = `Estás a ${(distance * 1000).toFixed(0)}m del centro de trabajo. Debes estar a menos de 200m para registrar salida.`;
          return;
        }
      }

      this.relojService.checkOut({ latitude: lat, longitude: lng }, this.selectedFile || undefined).subscribe(
        response => {
          if (response.status === 'success') {
            this.isClockedIn = false;
            this.selectedFile = null;
            Swal.fire('Éxito', 'Salida registrada correctamente', 'success');
            this.loadAttendanceHistory();
          }
        },
        error => Swal.fire('Error', error, 'error')
      );
    } catch (err) {
      console.error(err);
      // Fallback checkout without coordinates if GPS fails?
      // User requirements say "must allow checking at no more than 200m" for onsite.
      // For remote, it might be more flexible, but better to keep consistency.
      Swal.fire('Error', 'No se pudo obtener la ubicación para el registro de salida.', 'error');
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmitLeave(form: NgForm) {
    if (form.valid) {
      this.relojService.requestLeave(form.value).subscribe(
        response => {
          if (response.status === 'success') {
            Swal.fire('Solicitado', 'Tu permiso ha sido enviado a revisión.', 'success');
            form.reset();
          }
        },
        error => Swal.fire('Error', error, 'error')
      );
    }
  }

  // Haversine formula to calculate distance in km
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  downloadChecadorApp() {
    // Assuming the APK is hosted on the backend's download folder
    const apkUrl = this.relojService.url + '../downloads/apps/reloj_checador_sos.apk';
    window.open(apkUrl, '_blank');
  }
}
