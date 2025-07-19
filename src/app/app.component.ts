import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/welcome', icon: 'home' },
    { title: 'Voters List', url: '/home', icon: 'list' },
    { title: 'Add New Voter', url: '/voter-add', icon: 'person-add' }
  ];
  constructor() {}
}
