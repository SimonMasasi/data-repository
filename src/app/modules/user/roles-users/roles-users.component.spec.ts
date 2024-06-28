import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesUsersComponent } from './roles-users.component';

describe('RolesUsersComponent', () => {
  let component: RolesUsersComponent;
  let fixture: ComponentFixture<RolesUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolesUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
