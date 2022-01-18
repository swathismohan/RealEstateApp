import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyeronboardingComponent } from './buyeronboarding.component';

describe('BuyeronboardingComponent', () => {
  let component: BuyeronboardingComponent;
  let fixture: ComponentFixture<BuyeronboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyeronboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyeronboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
