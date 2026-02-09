import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsientosComponent } from './asientos.component';

describe('AsientosComponent', () => {
  let component: AsientosComponent;
  let fixture: ComponentFixture<AsientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
