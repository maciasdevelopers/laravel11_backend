import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesMedidaComponent } from './unidades-medida.component';

describe('UnidadesMedidaComponent', () => {
  let component: UnidadesMedidaComponent;
  let fixture: ComponentFixture<UnidadesMedidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnidadesMedidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadesMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
