import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../api/storage.service';


@Component({
  selector: 'app-voter-edit',
  templateUrl: './voter-edit.page.html',
  styleUrls: ['./voter-edit.page.scss'],standalone: false
})
export class VoterEditPage implements OnInit {
  voterId: any;
  loading: Boolean = true;
  loadingCtrl2: any;
  voterForm: FormGroup;

  districts: any[] = [];
  vidhanSabhas: any[] = [];
  wards: any[] = [];
  mohallas: any[] = [];

  selectedDistrict: string = '';
  selectedVS: string = '';
  selectedWard: string = '';
  selectedMohalla: string = '';
  saving: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private storage: StorageService
  ) {
    this.voterId = +this.route.snapshot.paramMap.get('id')!;
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
      district: ['', Validators.required],
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
    this.setVoters();
  }

  async setVoters() {
    try {
      const data = await this.storage.getVoterByID(this.voterId)
      this.districts = await this.storage.getDistricts();
      if (data) {
        let _voter = data;
        this.voterForm.controls['name_en'].setValue(_voter.name_en);
        this.voterForm.controls['name_hi'].setValue(_voter.name_hi);
        this.voterForm.controls['mobile_no'].setValue(_voter.mobile_no);
        this.voterForm.controls['gender'].setValue(_voter.gender);
        this.voterForm.controls['dob'].setValue(_voter.dob);
        this.voterForm.controls['whatsapp_no'].setValue(_voter.whatsapp_no);
        this.voterForm.controls['email'].setValue(_voter.email);
        this.voterForm.controls['relative_name'].setValue(_voter.relative_name);
        this.voterForm.controls['qualification'].setValue(_voter.qualification);
        this.voterForm.controls['graduation_university'].setValue(_voter.graduation_university);
        this.voterForm.controls['graduation_year'].setValue(_voter.graduation_year);
        this.voterForm.controls['qualification_certificate_for'].setValue(_voter.qualification_certificate_for);
        this.voterForm.controls['profession'].setValue(_voter.profession);
        this.voterForm.controls['additional_document'].setValue(_voter.additional_document);
        this.voterForm.controls['address'].setValue(_voter.address);
        this.voterForm.controls['house_no'].setValue(_voter.house_no);
        this.voterForm.controls['gali'].setValue(_voter.gali);
        this.voterForm.controls['village_town'].setValue(_voter.village_town);
        this.voterForm.controls['post_office'].setValue(_voter.post_office);
        this.voterForm.controls['tehsil'].setValue(_voter.tehsil);
        this.voterForm.controls['voter_uid'].setValue(_voter.voter_uid);

        if(_voter.district) {
          this.voterForm.controls['district'].setValue(_voter.district);
          this.onDistrictChange(_voter.district);
        }
        if(_voter.vidhan_sabha_id) {
          setTimeout(() => {
            this.onVSChange(_voter.vidhan_sabha_id);
            this.voterForm.controls['vidhan_sabha_id'].setValue(_voter.vidhan_sabha_id);
          }, 400);
        }
        if(_voter.ward_id) {
          setTimeout(() => {
            this.onWardChange(_voter.ward_id);
            this.voterForm.controls['ward_id'].setValue(_voter.ward_id);
          }, 600);
        }
        if(_voter.mohalla_id) {
          setTimeout(() => {
            this.onMohallaChange(_voter.mohalla_id);
            this.voterForm.controls['mohalla_id'].setValue(_voter.mohalla_id);
          }, 800);
        }
        this.voterForm.controls['aadhaar_voter_id'].setValue(_voter.aadhaar_voter_id);

      }
    } catch (error) {
      console.error('Failed to load voter', error);
    }
      
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

  async onSubmit() {
    this.saving = true;

    if (this.voterForm.valid) {
      this.showLoading();
      
      if(!this.voterForm.value.voter_uid) {
        let uid = this.generateVoterUID(this.voterForm.value);
        if(uid) {
          this.voterForm.controls['voter_uid'].setValue(uid);
        }
        console.log(uid);
      }
      
      const formData = this.voterForm.value;

      setTimeout(() => {

          this.storage.updateVoter(this.voterId, formData)
          .then((result:any) => {
            console.log(result);

            this.loadingCtrl2.dismiss();
            this.presentToast('secondary', 'Voter updated successfully!');
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
