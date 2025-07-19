import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
declare const window: any;

@Component({
  selector: 'app-voter-add',
  templateUrl: './voter-add.page.html',
  styleUrls: ['./voter-add.page.scss'],standalone: false
})
export class VoterAddPage implements OnInit {

  voterForm: FormGroup;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController
  ) {
    this.voterForm = this.fb.group({
      name_en: ['', Validators.required],
      name_hi: [''],
      mobile_no: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      gender: ['male'],
      dob: [''],
      whatsapp_no: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.email]],
      relative_name: [''],
      qualification: [''],
      graduation_university: [''],
      graduation_year: [''],
      qualification_certificate_for: [''],
      profession: [''],
      additional_document: [''],
      address: [''],
      house_no: [''],
      gali: [''],
      village_town: [''],
      post_office: [''],
      tehsil: [''],
      district: [''],
      area: [''],
      vidhan_sabha_id: [''],
      ward_id: [''],
      mohalla_id: [''],
      aadhaar_voter_id: [''],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.voterForm.valid) {
      this.showLoading();
      const formData = this.voterForm.value;
      console.log('Submitting Voter:', formData);

      (window as any).electronAPI.insertVoter(formData)
      .then((result:any) => {
        console.log('Inserted:', result);
        this.presentToast('secondary', 'Voter added successfully!');
        this.voterForm.reset();
        this.router.navigate(['/welcome']);
      })
      .catch((err:any) => {
        console.error('Insert Error:', err);
        this.presentToast('dark', 'Somthing went wrong!');
      });
    } else {
      console.log('Form is invalid');
    }

    // setTimeout(() => {
    //   this.presentToast('secondary', 'Voter added successfully!');
    //   this.router.navigate(['/welcome']);
    // }, 3500);
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'app-loader',
      message: 'Saving...',
      duration: 3000,
      backdropDismiss: true
    });

    loading.present();
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
