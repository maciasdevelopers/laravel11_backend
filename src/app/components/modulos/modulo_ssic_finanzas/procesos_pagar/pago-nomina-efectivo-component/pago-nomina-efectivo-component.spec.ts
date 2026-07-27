import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { PagoNominaEfectivoComponent } from './pago-nomina-efectivo-component';

describe('PagoNominaEfectivoComponent', () => {
  let component: PagoNominaEfectivoComponent;
  let fixture: ComponentFixture<PagoNominaEfectivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagoNominaEfectivoComponent],
      imports: [
        TranslateModule.forRoot(),
        TableModule,
        SelectModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        DividerModule,
        FormsModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoNominaEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
