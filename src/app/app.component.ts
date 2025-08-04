import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { EventsService } from './api/events.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

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
    { title: 'Add New Voter', url: '/voter-add', icon: 'person-add' },
    { title: 'Sync to Server', url: '/upload', icon: 'cloud-upload' }
  ];
  isAuth: Boolean = false;
  app_user:any=[];
  constructor(private platform: Platform, private router: Router,private alertController: AlertController, private events: EventsService) {
    this.init();
    this.checkAuth();
    this.events.subscribe('user:updated', (data:any) => {
      this.checkAuth();
    });
  }

  init() {
    this.platform.ready().then(async () => {
        if (Capacitor.isNativePlatform()) {
          StatusBar.setStyle({ style: Style.Dark }); // or Style.Dark
        }
    });
  }

  checkAuth() {
    let _eu = localStorage.getItem('ems_app_user');
    if(_eu) {
      this.isAuth = true;
      this.app_user = JSON.parse(_eu);
    } else {
      this.isAuth = false;
    }
    console.log(this.app_user);
    
  }

  async logOut() {

    const alert = await this.alertController.create({
      header: 'Logout!',
      message: 'Are you sure you want to logout?',
      mode: 'md',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Yes',
          handler: () => {
            localStorage.removeItem('ems_app_user');
            localStorage.clear();
            this.isAuth = false;
            this.events.publish('user:updated',{});
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });

    await alert.present();
  }
}
