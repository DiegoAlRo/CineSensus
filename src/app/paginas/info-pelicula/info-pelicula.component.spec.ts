import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPeliculaComponent } from './info-pelicula.component';

describe('InfoPeliculaComponent', () => {
  let component: InfoPeliculaComponent;
  let fixture: ComponentFixture<InfoPeliculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPeliculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPeliculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
