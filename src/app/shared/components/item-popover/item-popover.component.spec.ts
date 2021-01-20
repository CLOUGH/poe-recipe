import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPopoverComponent } from './item-popover.component';

describe('ItemPopoverComponent', () => {
  let component: ItemPopoverComponent;
  let fixture: ComponentFixture<ItemPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
