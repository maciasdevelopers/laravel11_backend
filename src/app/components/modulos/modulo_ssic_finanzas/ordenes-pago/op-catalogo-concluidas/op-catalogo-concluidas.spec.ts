import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

import { OpCatalogoConcluidas } from './op-catalogo-concluidas';

describe('OpCatalogoConcluidas', () => {
  let component: OpCatalogoConcluidas;
  let fixture: ComponentFixture<OpCatalogoConcluidas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpCatalogoConcluidas],
      imports: [
        TranslateModule.forRoot(),
        TableModule,
        DialogModule,
        DatePickerModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        FormsModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpCatalogoConcluidas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
