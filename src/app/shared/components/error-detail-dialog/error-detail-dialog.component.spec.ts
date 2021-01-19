import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDetailDialogComponent } from './error-detail-dialog.component';

describe('ErrorDetailDialogComponent', () => {
  let component: ErrorDetailDialogComponent;
  let fixture: ComponentFixture<ErrorDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
