import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController, ActionSheetController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../api/api.service';
import { Router } from '@angular/router';
import { EventsService } from '../../api/events.service';
import { StorageService } from '../../api/storage.service';

@Component({
  selector: 'app-voter-add',
  templateUrl: './voter-add.page.html',
  styleUrls: ['./voter-add.page.scss'],standalone: false
})
export class VoterAddPage implements OnInit {

  voterForm: FormGroup;

  constructor(
    private storage: StorageService,
    private events: EventsService,
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController,
    private router: Router,
    private fb: FormBuilder,
    private alertController: AlertController,
    private api: ApiService,
    private loadingCtrl: LoadingController
  ) {
    this.voterForm = this.fb.group({
      name_en: ['', Validators.required],
      name_hi: [''],
      mobile_no: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      gender: ['', Validators.required],
      dob: [''],
      whatsapp_no: [''],
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
      vidhan_sabha_id: ['', Validators.required],
      ward_id: ['', Validators.required],
      mohalla_id: ['', Validators.required],
      aadhaar_voter_id: [''],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.voterForm.valid) {
      const formData = this.voterForm.value;
      console.log('Submitting Voter:', formData);
      // Call storage or API service here
    } else {
      console.log('Form is invalid');
    }
  }

}
