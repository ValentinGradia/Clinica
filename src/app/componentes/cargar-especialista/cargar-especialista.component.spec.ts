import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarEspecialistaComponent } from './cargar-especialista.component';

describe('CargarEspecialistaComponent', () => {
  let component: CargarEspecialistaComponent;
  let fixture: ComponentFixture<CargarEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarEspecialistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
