import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterEditPage } from './voter-edit.page';

describe('VoterEditPage', () => {
  let component: VoterEditPage;
  let fixture: ComponentFixture<VoterEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
