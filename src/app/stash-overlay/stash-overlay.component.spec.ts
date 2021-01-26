import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashOverlayComponent } from './stash-overlay.component';

describe('StashOverlayComponent', () => {
  let component: StashOverlayComponent;
  let fixture: ComponentFixture<StashOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StashOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
