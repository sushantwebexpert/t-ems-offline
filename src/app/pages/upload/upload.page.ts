import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { StorageService } from '../../api/storage.service';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],standalone: false
})
export class UploadPage implements OnInit {

  voters: any = [];
  synced_voters: any = [];
  loading: Boolean = true;
  masterSync: Boolean = false;
  srvrSync: Boolean = false;
  syncmsg: any='';
  srvrMsg: any='';
  insertedID:any = [];
  constructor(private http: HttpClient,private api: ApiService, private toastController: ToastController, private storage: StorageService) { }

  ngOnInit() {
    setTimeout(async () => {

      // for (const id of [3,5]) {
      //    await this.storage.deleteVoterByID(id);
      // }

      this.getAllVoters();

    }, 1000);
  }

  async getAllVoters() {

    this.storage.getAllVotersBySynced(0)
      .then((result:any) => {
          console.log(result);
          if(result) {
                this.voters = result;
                this.loading = false;
          }
      })
      .catch((err:any) => {
        console.error('Insert Error:', err);
        this.loading = false;
      });

      this.storage.getAllVotersBySynced(1)
        .then((result:any) => {
            console.log(result);
            if(result) {
                  this.synced_voters = result;
                  this.loading = false;
            }
        })
        .catch((err:any) => {
          console.error('Insert Error:', err);
          this.loading = false;
        });

    }

  

  async syncToServer() {
    this.srvrSync = true;
    this.srvrMsg = '';
    console.log(this.voters);

    for (const voter of this.voters) {
      const formData = new FormData();

      for (const key in voter) {
        if (
        key !== 'photo_url' &&
        key !== 'graduation_url' &&
        key !== 'aadhaar_url' &&
        key !== 'aadhaar2_url' &&
        key !== 'voterid_url' &&
        key !== 'voterid2_url' &&
        voter[key] !== undefined &&
        voter[key] !== null
        ) {
          formData.append(key, voter[key]);
        }
      }

      let adasdas = await this.blobToBase64(voter.photo_url);
      console.log(adasdas);
      

      if (voter.photo_url) { formData.append('photo_url', voter.photo_url, voter['id'] + "_" + voter.photo_url.name ); }
      if (voter.graduation_url) { formData.append('graduation_url', voter.graduation_url, voter['id'] + "_" + voter.graduation_url.name); }
      if (voter.aadhaar_url) { formData.append('aadhaar_url', voter.aadhaar_url, voter['id'] + "_" + voter.aadhaar_url); }
      if (voter.aadhaar2_url) { formData.append('aadhaar2_url', voter.aadhaar2_url, voter['id'] + "_" + voter.aadhaar2_url.name); }
      if (voter.voterid_url) { formData.append('voterid_url', voter.voterid_url, voter['id'] + "_" + voter.voterid_url.name); }
      if (voter.voterid2_url) { formData.append('voterid2_url', voter.voterid2_url, voter['id'] + "_" + voter.voterid2_url.name); }


      // this.http.post(`${this.api.apiUrl}/syncvoters`, formData).subscribe(
      //   async (data:any) => {
      //       console.log(data);
      //       if(data.success) {
      //         if(data.inserted) {
      //           this.insertedID.push(data.id);
      //         }
      //       }
      //   },
      //   (err:any) => {
      //     console.log(err);
      //   }
      // );


       try {
          const response = await fetch(this.api.apiUrl + '/syncvoters', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
              const data = await response.json();
              if(data.inserted) {
                this.insertedID.push(voter.id);
              }
            // Optionally delete from Dexie here
          } else {
            console.error('❌ Failed to sync voter:', voter.name_en);
          }
        } catch (error) {
          console.error('⚠️ Error syncing voter:', error);
        }

    }
    this.srvrSync = false;
    this.presentToast('secondary', "All Done");
    this.setSynced();

    // this.api.saveVoterData(this.voters).subscribe(
    //   async (data:any) => {
    //     console.log(data);
    //       this.srvrSync = false;

    //       this.presentToast('secondary', data?.message);
    //       this.setSynced(data?.inserted_id);
    //     },
    //     (err:any) => {
    //       console.log(err);
    //       this.srvrSync = false;
    //     }
    //  );
      
  }

 blobToBase64(blob:any) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  async setSynced() {
    for (const id of this.insertedID) {
     await this.storage.updateVoterBySynced(id, 1);
    }
    this.getAllVoters();
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
