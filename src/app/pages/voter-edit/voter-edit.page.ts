import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
declare const window: any;

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

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController
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
      district: [''],
      area: [''],
      vidhan_sabha_id: [''],
      ward_id: [''],
      mohalla_id: [''],
      aadhaar_voter_id: [''],
    });
  }

  ngOnInit() {
    this.setVoters();
  }

  async setVoters() {
    try {
      const data = await (window as any).electronAPI.getVoterById(this.voterId);
      if (data?.voter) {
        let _voter = JSON.parse(data.voter);

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
        this.voterForm.controls['district'].setValue(_voter.district);
        this.voterForm.controls['area'].setValue(_voter.area);
        this.voterForm.controls['vidhan_sabha_id'].setValue(_voter.vidhan_sabha_id);
        this.voterForm.controls['ward_id'].setValue(_voter.ward_id);
        this.voterForm.controls['mohalla_id'].setValue(_voter.mohalla_id);
        this.voterForm.controls['aadhaar_voter_id'].setValue(_voter.aadhaar_voter_id);

      }
    } catch (error) {
      console.error('Failed to load voter', error);
    }
      
  }

  async onSubmit() {
    if (this.voterForm.valid) {
      this.showLoading();
      const formData = this.voterForm.value;

      setTimeout(() => {

          (window as any).electronAPI.updateVoter(this.voterId, formData)
          .then((result:any) => {
            this.loadingCtrl2.dismiss();
            this.presentToast('secondary', 'Voter updated successfully!');
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
