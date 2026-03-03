import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendadorComponent } from './recomendador.component';

describe('RecomendadorComponent', () => {
  let component: RecomendadorComponent;
  let fixture: ComponentFixture<RecomendadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
