import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetsListComponent } from './datasets-list.component';

describe('DatasetsListComponent', () => {
  let component: DatasetsListComponent;
  let fixture: ComponentFixture<DatasetsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetsListComponent]
    });
    fixture = TestBed.createComponent(DatasetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
