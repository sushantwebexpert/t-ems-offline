import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterViewPage } from './voter-view.page';

describe('VoterViewPage', () => {
  let component: VoterViewPage;
  let fixture: ComponentFixture<VoterViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
