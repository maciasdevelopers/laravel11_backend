import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { OpCatalogoPendientes } from './op-catalogo-pendientes';

describe('OpCatalogoPendientes', () => {
  let component: OpCatalogoPendientes;
  let fixture: ComponentFixture<OpCatalogoPendientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpCatalogoPendientes],
      imports: [
        TranslateModule.forRoot(),
        TableModule,
        DatePickerModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        DialogModule,
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

    fixture = TestBed.createComponent(OpCatalogoPendientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
