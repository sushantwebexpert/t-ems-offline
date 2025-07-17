import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterAddPage } from './voter-add.page';

describe('VoterAddPage', () => {
  let component: VoterAddPage;
  let fixture: ComponentFixture<VoterAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
