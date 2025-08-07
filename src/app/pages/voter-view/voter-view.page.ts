import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../api/storage.service';
import { ModalController } from '@ionic/angular';
import { OpenfilePage } from '../openfile/openfile.page';

@Component({
  selector: 'app-voter-view',
  templateUrl: './voter-view.page.html',
  styleUrls: ['./voter-view.page.scss'],standalone: false
})
export class VoterViewPage implements OnInit {
  voterId: any;
  voter: any = null;
  loading: Boolean = true;

  voter_district:any = '';
  voter_vidhan_sabha:any = '';
  voter_ward:any = '';
  voter_mohalla:any = '';

  imagesHtml_photo:any = '';
  imagesHtml_graduate:any = '';
  imagesHtml_aadhar:any = '';
  imagesHtml_aadhar2:any = '';
  imagesHtml_voterid:any = '';
  imagesHtml_voterid2:any = '';

  constructor(private route: ActivatedRoute, private storage: StorageService, private modalController: ModalController) {
    this.voterId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadVoter();
    }, 1500);
  }

  async loadVoter() {

    try {
      const data = await this.storage.getVoterByID(this.voterId)
      if (data) {
        console.log((data));
        
        this.voter = data;
        this.voter.id = data.id; // preserve ID for Edit link

        this.voter_district = await this.getNameById('districts', this.voter.district);
        this.voter_vidhan_sabha = await this.getNameById('vidhan_sabhas', this.voter.vidhan_sabha_id);
        this.voter_ward = await this.getNameById('wards', this.voter.ward_id);
        this.voter_mohalla = await this.getNameById('mohallas', this.voter.mohalla_id);

        if(this.voter.photo_url) {
          this.imagesHtml_photo = await this.blobToBase64(this.voter.photo_url);
        }
        if(this.voter.graduation_url) {
          this.imagesHtml_graduate = await this.blobToBase64(this.voter.graduation_url);
        }
        if(this.voter.aadhaar_url) {
          this.imagesHtml_aadhar = await this.blobToBase64(this.voter.aadhaar_url);
        }
        if(this.voter.aadhaar2_url) {
          this.imagesHtml_aadhar2 = await this.blobToBase64(this.voter.aadhaar2_url);
        }
        if(this.voter.voterid_url) {
          this.imagesHtml_voterid = await this.blobToBase64(this.voter.voterid_url);
        }
        if(this.voter.voterid2_url) {
          this.imagesHtml_voterid2 = await this.blobToBase64(this.voter.voterid2_url);
        }
      }
    } catch (error) {
      console.error('Failed to load voter', error);
    }
  }
  
  async getNameById(table:any, id:any) {
     try {
      const data = await this.storage.getNameById(table, id);
      console.log(data);
      
      if (data?.name_en) {
        return data.name_en;
      }
    } catch (error) {
      console.error('Failed to load voter', error);
    }
  }


  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

    // In your list page
    async openImage(image:any) {
      const modal = await this.modalController.create({
        component: OpenfilePage,
        componentProps: {
          imageUrl: image
        },
        cssClass: 'full-image-modal'
      });
      await modal.present();
    }

}
