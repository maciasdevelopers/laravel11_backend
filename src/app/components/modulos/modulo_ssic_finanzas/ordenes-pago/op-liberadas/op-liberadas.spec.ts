import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { OpLiberadas } from './op-liberadas';

describe('OpLiberadas', () => {
  let component: OpLiberadas;
  let fixture: ComponentFixture<OpLiberadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpLiberadas],
      imports: [
        TranslateModule.forRoot(),
        TableModule,
        DialogModule,
        DatePickerModule,
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

    fixture = TestBed.createComponent(OpLiberadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
