import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthoridedComponent } from './unauthorided.component';

describe('UnauthoridedComponent', () => {
  let component: UnauthoridedComponent;
  let fixture: ComponentFixture<UnauthoridedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthoridedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnauthoridedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
