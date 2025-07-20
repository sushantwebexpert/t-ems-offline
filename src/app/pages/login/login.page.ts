import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { EventsService } from '../../api/events.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loadingCtrl2:any;
  constructor(private router: Router, private fb: FormBuilder,
    private toastController: ToastController,
    private loadingCtrl: LoadingController, private events: EventsService
  ) {
    this.checkAuth();

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.events.subscribe('user:updated', (data:any) => {
      this.checkAuth();
    });
  }

  ngOnInit() {
  }

  checkAuth() {
    let _user= localStorage.getItem("ems_app_user");
    if(_user) {
      this.router.navigate(['/welcome']);
    }
  }

  async onSubmit() {
    this.showLoading();
      setTimeout(():any => {

          console.log(this.loginForm.value);
  
          if(!this.loginForm.valid) {
            this.presentToast('dark', 'Enter your credentials!');
            this.loadingCtrl2.dismiss();
            return false;
          }
          
          if(this.loginForm.value.email == 'abcd' && this.loginForm.value.password == '1234') {
            this.loadingCtrl2.dismiss();
            localStorage.setItem('ems_app_user', JSON.stringify({'name': 'Sushant'}));
            this.events.publish('user:updated',{});
            this.router.navigate(['/home'], { replaceUrl: true });
          } else {
            this.presentToast('dark', 'Wrong credentials!');
            this.loadingCtrl2.dismiss();
          }
  
        }, 1000);
  }

  async showLoading() {
    this.loadingCtrl2 = await this.loadingCtrl.create({
      cssClass: 'app-loader',
      message: 'Saving...',
      duration: 3000,
      backdropDismiss: true
    });

    this.loadingCtrl2.present();
  }

  async presentToast(colorCode:any, msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
      color : colorCode
    });

    await toast.present();
  }

}
