import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NavegadorPrincipalComponent } from './navegador_principal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DrawerModule } from 'primeng/drawer';
import { TreeModule } from 'primeng/tree';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { SessionContextService } from '../../../../servicios/session-context';
import { of } from 'rxjs';

describe('NavegadorPrincipalComponent', () => {
  let component: NavegadorPrincipalComponent;
  let fixture: ComponentFixture<NavegadorPrincipalComponent>;

  beforeEach(async () => {
    const sentinelMock = {
      getIdentifUsuario: () => ({ name: 'Test User', avatar: 'test-avatar.png' }),
      usuario_logout_main: () => of({ status: 'success' })
    };

    const sessionMock = {
      modulos$: of([]),
      empresa$: () => of(null),
      empresa_data: { es_administradora: false, company_name_short: 'Test Co', logotypo: 'logo.png' },
      lenguaje: 'es'
    };

    await TestBed.configureTestingModule({
      declarations: [ NavegadorPrincipalComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        NgbModule,
        DrawerModule,
        TreeModule,
        ToastModule,
        DialogModule,
        AvatarModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        MessageService,
        { provide: SentinelArkManager, useValue: sentinelMock },
        { provide: SessionContextService, useValue: sessionMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavegadorPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
