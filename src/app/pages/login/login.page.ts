import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { EventsService } from '../../api/events.service';
import { ApiService } from 'src/app/api/api.service';

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
    private loadingCtrl: LoadingController, private events: EventsService,
    private api: ApiService
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

    if(!this.loginForm.valid) {
      this.presentToast('dark', 'Enter your credentials!');
      this.loadingCtrl2.dismiss();
      return false;
    }

    this.api.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      (res:any) => {
        if(res.status) {
            this.loadingCtrl2.dismiss();
            localStorage.setItem('ems_app_user', JSON.stringify(res.user));
            localStorage.setItem('ems_app_user_district', res.user.district);
            this.events.publish('user:updated',{});
            this.router.navigate(['/home'], { replaceUrl: true });
            this.presentToast('dark', res.message);
        } else {
          this.loadingCtrl2.dismiss();
          this.presentToast('dark', res.message);
        }
      },
      (err:any) => {
        this.loadingCtrl2.dismiss();
        if(err.error) {
          this.presentToast('dark', err.error.message);
        } else {
          this.presentToast('dark', 'Somthing went wrong');
        }
      },
      () => {
        this.loadingCtrl2.dismiss();
      }
    );




     

          console.log(this.loginForm.value);
  

          
          // if(this.loginForm.value.email == 'abcd' && this.loginForm.value.password == '1234') {
          //   this.loadingCtrl2.dismiss();
          //   localStorage.setItem('ems_app_user', JSON.stringify({'name': 'Sushant'}));
          //   this.events.publish('user:updated',{});
          //   this.router.navigate(['/home'], { replaceUrl: true });
          // } else {
          //   this.presentToast('dark', 'Wrong credentials!');
          //   this.loadingCtrl2.dismiss();
          // }
  
        }, 100);
  }

  async showLoading() {
    this.loadingCtrl2 = await this.loadingCtrl.create({
      cssClass: 'app-loader',
      message: 'Logging in...',
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
