import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRoomsImagesComponent } from './manage-rooms-images.component';

describe('ManageRoomsImagesComponent', () => {
  let component: ManageRoomsImagesComponent;
  let fixture: ComponentFixture<ManageRoomsImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRoomsImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageRoomsImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
