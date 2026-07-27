import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventServVentasMostradorRegistroComponent } from './invent-serv-ventas-mostrador-registro.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

describe('InventServVentasMostradorRegistroComponent', () => {
  let component: InventServVentasMostradorRegistroComponent;
  let fixture: ComponentFixture<InventServVentasMostradorRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventServVentasMostradorRegistroComponent ],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventServVentasMostradorRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
