import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeciPerfilesUsuariosComponent } from './teci-perfiles-usuarios.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EmpleadosService } from '../../../../servicios/ssic/empleados.service';
import { EmpresasServService } from '../../../../servicios/ssic/empresas-serv.service';
import { UsuariosService } from '../../../../servicios/serv_user.service';
import { of } from 'rxjs';

describe('TeciPerfilesUsuariosComponent', () => {
  let component: TeciPerfilesUsuariosComponent;
  let fixture: ComponentFixture<TeciPerfilesUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeciPerfilesUsuariosComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: EmpleadosService,
          useValue: {
            catalogoAreasEmp: () => of({ status: 'success', areas: [] })
          }
        },
        {
          provide: EmpresasServService,
          useValue: {
            listaEmpresasAll: () => of({ status: 'success', companies: [] })
          }
        },
        {
          provide: UsuariosService,
          useValue: {
            usuarios_catalogo_general: () => of({ status: 'success', usuarios: [] })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeciPerfilesUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
