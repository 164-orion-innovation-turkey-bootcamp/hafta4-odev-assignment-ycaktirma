import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopComponent } from './shop.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopComponent ],
      imports:[HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
