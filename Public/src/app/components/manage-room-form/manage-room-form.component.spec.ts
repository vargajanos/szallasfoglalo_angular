import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRoomFormComponent } from './manage-room-form.component';

describe('ManageRoomFormComponent', () => {
  let component: ManageRoomFormComponent;
  let fixture: ComponentFixture<ManageRoomFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRoomFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageRoomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
