import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventServVentasMostradorListaComponent } from './invent-serv-ventas-lista-mostrador.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('InventServVentasMostradorListaComponent', () => {
  let component: InventServVentasMostradorListaComponent;
  let fixture: ComponentFixture<InventServVentasMostradorListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventServVentasMostradorListaComponent ],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventServVentasMostradorListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
