import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectoresDeMenuComponent } from './selectores-de-menu.component';

describe('SelectoresDeMenuComponent', () => {
  let component: SelectoresDeMenuComponent;
  let fixture: ComponentFixture<SelectoresDeMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectoresDeMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectoresDeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
