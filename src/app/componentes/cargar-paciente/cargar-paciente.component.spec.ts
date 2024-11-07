import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarPacienteComponent } from './cargar-paciente.component';

describe('CargarPacienteComponent', () => {
  let component: CargarPacienteComponent;
  let fixture: ComponentFixture<CargarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
