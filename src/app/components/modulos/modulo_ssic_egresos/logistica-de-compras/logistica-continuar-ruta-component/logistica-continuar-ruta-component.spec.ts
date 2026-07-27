import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticaContinuarRutaComponent } from './logistica-continuar-ruta-component';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('LogisticaContinuarRutaComponent', () => {
  let component: LogisticaContinuarRutaComponent;
  let fixture: ComponentFixture<LogisticaContinuarRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogisticaContinuarRutaComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticaContinuarRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
