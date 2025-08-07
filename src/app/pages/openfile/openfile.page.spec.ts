import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenfilePage } from './openfile.page';

describe('OpenfilePage', () => {
  let component: OpenfilePage;
  let fixture: ComponentFixture<OpenfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
