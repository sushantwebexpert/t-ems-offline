import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],standalone: false
})
export class WelcomePage implements OnInit {
  _dis:any;
  constructor() { }

  ngOnInit() {
    this._dis = localStorage.getItem('ems_app_user_district');
  }

  handleChange($event:any) {
    localStorage.setItem('ems_app_user_district', $event.detail.value);
  }

}
