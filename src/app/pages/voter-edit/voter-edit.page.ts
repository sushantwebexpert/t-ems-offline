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
    // let v:any = `{"name_en":"Sushant","name_hi":"anshu","mobile_no":"9876543210","gender":"male","dob":"2025-07-18","whatsapp_no":"8884234234","email":"sss@dfmfgh.gfhg","relative_name":"jhj","qualification":"ghfgh","graduation_university":"fghf","graduation_year":2016,"qualification_certificate_for":"hfghjhj","profession":"dfgg","additional_document":"dg","address":"jghj","house_no":"ghjghj","gali":"ghjghj","village_town":"ghjghj","post_office":"ghj","tehsil":"ghjghj","district":"mbnmbnm","area":"bn,m,g","vidhan_sabha_id":"","ward_id":"","mohalla_id":"","aadhaar_voter_id":"4234324"}`;
    // let _voter = JSON.parse(v);

      
  }

  async onSubmit() {
    if (this.voterForm.valid) {
      this.showLoading();
      const formData = this.voterForm.value;
      console.log('Submitting Voter:', formData);

      (window as any).electronAPI.updateVoter(this.voterId, formData)
      .then((result:any) => {
        console.log('Updated:', result);
        this.presentToast('secondary', 'Voter updated successfully!');
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
    //   this.presentToast('secondary', 'Voter updated successfully!');
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
