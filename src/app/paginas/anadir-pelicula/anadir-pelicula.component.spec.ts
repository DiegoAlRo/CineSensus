import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirPeliculaComponent } from './anadir-pelicula.component';

describe('AnadirPeliculaComponent', () => {
  let component: AnadirPeliculaComponent;
  let fixture: ComponentFixture<AnadirPeliculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirPeliculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnadirPeliculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
