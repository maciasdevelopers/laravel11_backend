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
import { MessageService } from 'primeng/api';

import { DispersionNominasLiberadas } from './dispersion-nominas-liberadas';

describe('DispersionNominasLiberadas', () => {
  let component: DispersionNominasLiberadas;
  let fixture: ComponentFixture<DispersionNominasLiberadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispersionNominasLiberadas],
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
        provideHttpClientTesting(),
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispersionNominasLiberadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
