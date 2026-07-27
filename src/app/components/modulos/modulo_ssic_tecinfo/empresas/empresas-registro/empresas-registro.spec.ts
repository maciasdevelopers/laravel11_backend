import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresasRegistro } from './empresas-registro';
import { provideZonelessChangeDetection } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EmpresasServService } from '../../../../../servicios/ssic/empresas-serv.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { SessionContextService } from '../../../../../servicios/session-context';
import { of } from 'rxjs';

describe('EmpresasRegistro', () => {
  let component: EmpresasRegistro;
  let fixture: ComponentFixture<EmpresasRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpresasRegistro],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: EmpresasServService,
          useValue: {
            regimen_fiscal_catalogo: () => of({ status: 'success', regimenes: [] }),
            paises_ssic_catalogo: () => of({ status: 'success', paises: [] })
          }
        },
        {
          provide: ValidatorServService,
          useValue: {
            strFilter: () => true,
            filtroRFC: () => true,
            filtroCURP: () => true,
            filtroNum: () => true
          }
        },
        {
          provide: SessionContextService,
          useValue: {
            lenguaje$: of('es')
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresasRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
