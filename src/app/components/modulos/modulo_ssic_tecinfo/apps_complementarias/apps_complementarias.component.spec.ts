import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppsComplementariasComponent } from './apps_complementarias.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { RelojChecadorService } from '../../../../servicios/ssic/reloj-checador.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

describe('AppsComplementariasComponent', () => {
  let component: AppsComplementariasComponent;
  let fixture: ComponentFixture<AppsComplementariasComponent>;
  let mockRelojService: any;

  beforeEach(async () => {
    mockRelojService = {
      getUserWorkProfile: jasmine.createSpy('getUserWorkProfile').and.returnValue(of({ status: 'success', profile: {} })),
      getAttendanceHistory: jasmine.createSpy('getAttendanceHistory').and.returnValue(of({ status: 'success', history: [] }))
    };

    await TestBed.configureTestingModule({
      declarations: [AppsComplementariasComponent],
      imports: [
        FormsModule,
        TabsModule,
        TableModule,
        ButtonModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RelojChecadorService, useValue: mockRelojService },
        DatePipe
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsComplementariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
