import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../../api/storage.service';
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

  saving: Boolean = false;
  submiting: Boolean = false;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private storage: StorageService
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
      is_synced: [0],
    });
  }

  ngOnInit() {
    setTimeout(async () => {
      let d:any = await this.storage.getDistricts();
      if(d) {
        this.districts = d;
      }
      console.log(this.districts);
    }, 1000);
  }

  async onDistrictChange(district_id: string) {
    this.selectedDistrict = district_id;
    console.log(district_id);
    let vs:any = await this.storage.getVidhanSabhas(district_id);
    if(vs) {
      this.vidhanSabhas = vs;
    }


    console.log(this.vidhanSabhas);
    
    this.wards = [];
    this.mohallas = [];
    this.voterForm.controls['area'].setValue('');
  }

  async onVSChange(vs_id: string) {
    this.selectedVS = vs_id;
    let w:any = await this.storage.getWards(vs_id);
    if(w) {
      this.wards = w;
    }
    console.log(this.wards);

    this.mohallas = [];
    this.voterForm.controls['area'].setValue('');
  }

  async onWardChange(ward_id: string) {
    this.selectedWard = ward_id;
    let m:any = await this.storage.getMohallas(ward_id);
    if(m) {
      this.mohallas = m;
    }
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

  async onSave() {
    if(this.submiting) {
      return false;
    }
    this.saving = true;

    console.log('saving', this.saving);
    console.log('submiting', this.submiting);


    console.log('saving', this.saving);
    console.log('submiting', this.submiting);


    if (this.voterForm.valid) {

      this.showLoading();
      
      let uid = this.generateVoterUID(this.voterForm.value);
      if(uid) {
        this.voterForm.controls['voter_uid'].setValue(uid);
      }

      const formData = this.voterForm.value;

      console.log(uid);

      setTimeout(() => {

          

          this.storage.saveVoter(formData)
          .then((result:any) => {
            console.log(result);

            this.loadingCtrl2.dismiss();
            this.presentToast('secondary', 'Voter added successfully!');
            this.voterForm.reset();
            this.router.navigate(['/welcome']);
          })
          .catch((err:any) => {
            console.log(err);
            
            this.presentToast('dark', 'Somthing went wrong!');
          });

      }, 1500);

    } else {
      console.log('Form is invalid');
      this.saving = false;
    }
    return;
  }

  async onSubmit() {
    if(this.saving) {
      return false;
    }
    this.submiting = true;
    console.log('saving', this.saving);
    console.log('submiting', this.submiting);

    console.log('saving', this.saving);
    console.log('submiting', this.submiting);

    setTimeout(() => {
    this.submiting = false;
    }, 2000);
    return;

    // if (this.voterForm.valid) {
    //   this.showLoading();
    
    //  let uid = this.generateVoterUID(this.voterForm.value);
    //  if(uid) {
      //   this.voterForm.controls['voter_uid'].setValue(uid);
      //  }

     //   const formData = this.voterForm.value;

      //  console.log(uid);
    //   setTimeout(() => {

    //       (window as any).electronAPI.insertVoter(formData)
    //       .then((result:any) => {
    //         this.loadingCtrl2.dismiss();
    //         this.presentToast('secondary', 'Voter added successfully!');
    //         this.voterForm.reset();
    //         this.router.navigate(['/welcome']);
    //       })
    //       .catch((err:any) => {
    //         this.presentToast('dark', 'Somthing went wrong!');
    //       });

    //   }, 1500);

    // } else {
    //   console.log('Form is invalid');
    // }
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
