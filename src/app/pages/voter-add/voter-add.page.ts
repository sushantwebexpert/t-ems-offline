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
  loadingCtrl2: any;

  districts: any[] = [];
  vidhanSabhas: any[] = [];
  wards: any[] = [];
  mohallas: any[] = [];

  selectedDistrict: string = '';
  selectedVS: string = '';
  selectedWard: string = '';
  selectedMohalla: string = '';

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
      voter_uid: [''],
    });
  }

  ngOnInit() {
    setTimeout(async () => {
      this.districts = await (window as any).electronAPI.getDistricts();
      console.log(this.districts);
    }, 1000);
  }

  async onDistrictChange(district_id: string) {
    this.selectedDistrict = district_id;
    console.log(district_id);
    
    this.vidhanSabhas = await (window as any).electronAPI.getVidhanSabhas(district_id);
    console.log(this.vidhanSabhas);
    
    this.wards = [];
    this.mohallas = [];
    this.voterForm.controls['area'].setValue('');
  }

  async onVSChange(vs_id: string) {
    this.selectedVS = vs_id;
    this.wards = await (window as any).electronAPI.getWards(vs_id);
    console.log(this.wards);

    this.mohallas = [];
    this.voterForm.controls['area'].setValue('');
  }

  async onWardChange(ward_id: string) {
    this.selectedWard = ward_id;
    this.mohallas = await (window as any).electronAPI.getMohallas(ward_id);
    console.log(this.mohallas);
    this.voterForm.controls['area'].setValue('');
  }

  async onMohallaChange(mohalla_id: any) {
    console.log(mohalla_id);
    const selected = this.mohallas.find(m => m.id === mohalla_id);
    const _area = selected?.area || '';
    this.voterForm.controls['area'].setValue(_area);
  }

  generateVoterUID(voter: any): string {
    const phone = voter.mobile_no || '00000';
    const last5 = phone.slice(-5);
    const created = new Date(voter.created_at || Date.now())
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 8);
    const namePart = (voter.name_en || 'XXX').replace(/[^A-Z]/gi, '').slice(0, 4).toUpperCase();
    return `V-${last5}-${created}-${namePart}`;
  }

  async onSubmit() {
    if (this.voterForm.valid) {
      this.showLoading();
      const formData = this.voterForm.value;

     let uid = this.generateVoterUID(this.voterForm.value);
     if(uid) {
      this.voterForm.controls['voter_uid'].setValue(uid);
     }
     console.log(uid);
      setTimeout(() => {

          (window as any).electronAPI.insertVoter(formData)
          .then((result:any) => {
            this.loadingCtrl2.dismiss();
            this.presentToast('secondary', 'Voter added successfully!');
            this.voterForm.reset();
            this.router.navigate(['/welcome']);
          })
          .catch((err:any) => {
            this.presentToast('dark', 'Somthing went wrong!');
          });

      }, 1500);

    } else {
      console.log('Form is invalid');
    }
  }

  async showLoading() {
    this.loadingCtrl2 = await this.loadingCtrl.create({
      cssClass: 'app-loader',
      message: 'Saving...',
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
