import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MydatasetComponent } from './mydataset.component';

describe('MydatasetComponent', () => {
  let component: MydatasetComponent;
  let fixture: ComponentFixture<MydatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MydatasetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MydatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
