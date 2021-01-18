import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashTabComponent } from './stash-tab.component';

describe('StashTabComponent', () => {
  let component: StashTabComponent;
  let fixture: ComponentFixture<StashTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StashTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
