import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../../api/storage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


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
  actionSheet:any;

  selectedImages: { [key: string]: File | null } = {
    photo: null,
    graduation: null,
    aadhaar: null,
    aadhaar2: null,
    voterid: null,
    voterid2: null
  };

  doc_photo: any = null;
  doc_graduation: any = null;
  doc_aadhaar: any = null;
  doc_aadhaar2: any = null;
  doc_voterid: any = null;
  doc_voterid2: any = null;
  imgload: boolean = false;

  app_user:any;
  pageLoading: Boolean = true;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private storage: StorageService,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController
  ) {
    this.voterForm = this.fb.group({
      name_en: ['', Validators.required],
      name_hi: [''],
      mobile_no: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      gender: ['Male'],
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
      photo_url: [''],
      graduation_url: [''],
      aadhaar_url: [''],
      aadhaar2_url: [''],
      voterid_url: [''],
      voterid2_url: [''],
      is_synced: [0],
    });
  }

  ngOnInit() {
    setTimeout(async () => {
      let d:any = await this.storage.getDistricts();
      if(d) { this.districts = d; }

      let app_user:any = localStorage.getItem('ems_app_user');
      if(app_user) {
        this.app_user = JSON.parse(app_user);
        this.pageLoading = false;
        if(this.app_user?.district_id) {
          this.voterForm.controls['district'].setValue(this.app_user.district_id);
          this.onDistrictChange(this.app_user.district_id);
          if(this.app_user.district != 'lucknow') {
              let w:any = await this.storage.getWardsByDistric(this.app_user.district_id);
              if(w) { this.wards = w; }
              this.voterForm.controls['area'].setValue('R');
          } 
        }
      }
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

  async capturePhoto(type:any) {
    this.actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Take a Photo',
          icon: 'camera',
          handler: () => this.selectImage(CameraSource.Camera,type),
        },
        {
          text: 'Choose from Gallery',
          icon: 'image',
          handler: () => this.selectImage(CameraSource.Photos,type),
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await this.actionSheet.present();
  }

  async selectImage(source: CameraSource, type:any) {

    this.imgload = true;
    setTimeout(() => {
      this.imgload = false;
    }, 4000);

    this.actionSheet.dismiss();

    const image = await Camera.getPhoto({
      quality: 50,
      source: source,
      resultType: CameraResultType.Uri // Important: Get URI instead of base64
    });
  
    const blob = await fetch(image.webPath!).then(res => res.blob());
    const file = new File([blob], `${type}_${Date.now()}.jpg`, { type: "image/jpeg" });

    this.selectedImages[type] = file;
   
    if( 'photo' == type ) {
      this.doc_photo = image.webPath;
    }
    if( 'aadhaar' == type ) {
      this.doc_aadhaar = image.webPath;
    }
    if( 'aadhaar2' == type ) {
      this.doc_aadhaar2 = image.webPath;
    }
    if( 'voterid' == type ) {
      this.doc_voterid = image.webPath;
    }
    if( 'voterid2' == type ) {
      this.doc_voterid2 = image.webPath;
    }
    if( 'graduation' == type ) {
      this.doc_graduation = image.webPath;
    }
  
    this.imgload = false;
  }


  async removePhoto(type:any) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Delete canceled');
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.selectedImages[type] = null;
            if( 'photo' == type ) {
              this.doc_photo = null;
            }
            if( 'aadhaar' == type ) {
              this.doc_aadhaar = null;
            }
            if( 'aadhaar2' == type ) {
              this.doc_aadhaar2 = null;
            }
            if( 'voterid' == type ) {
              this.doc_voterid = null;
            }
            if( 'voterid2' == type ) {
              this.doc_voterid2 = null;
            }
            if( 'graduation' == type ) {
              this.doc_graduation = null;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async onSave() {
    this.saving = true;

    for (const key in this.selectedImages) {

        let _img:any = this.selectedImages[key] ? this.selectedImages[key] : null;
        let _key:any = key + '_url';
        console.log(_img);
        this.voterForm.controls[_key].setValue(_img);
    }

    if (this.voterForm.valid) {

      this.showLoading();
      
      // let uid = this.generateVoterUID(this.voterForm.value);
      // if(uid) {
      //   this.voterForm.controls['voter_uid'].setValue(uid);
      // }

      const formData = this.voterForm.value;

      // console.log(uid);
      console.log(formData);

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
      this.voterForm.get('name_en')?.markAsTouched();
      this.voterForm.get('mobile_no')?.markAsTouched();
      this.voterForm.get('whatsapp_no')?.markAsTouched();
      this.voterForm.get('email')?.markAsTouched();
      this.voterForm.get('district')?.markAsTouched();
      console.log('Form is invalid');
      this.saving = false;
    }
    return;
  }

  async onSubmit() {
    // if(this.saving) {
    //   return false;
    // }
    // this.submiting = true;
    // console.log('saving', this.saving);
    // console.log('submiting', this.submiting);

    // console.log('saving', this.saving);
    // console.log('submiting', this.submiting);

    // setTimeout(() => {
    // this.submiting = false;
    // }, 2000);
    // return;
  }

 toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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
