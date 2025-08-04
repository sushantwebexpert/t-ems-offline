import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { StorageService } from '../../api/storage.service';
import { ToastController } from '@ionic/angular';

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

  constructor(private api: ApiService, private toastController: ToastController, private storage: StorageService) { }

  ngOnInit() {
    setTimeout(() => {
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

  

  syncToServer() {
    this.srvrSync = true;
    this.srvrMsg = '';
    console.log(this.voters);

    this.api.saveVoterData(this.voters).subscribe(
      async (data:any) => {
        console.log(data);
          this.srvrSync = false;
          this.presentToast('secondary', data?.message);
          this.setSynced(data?.inserted_id);
        },
        (err:any) => {
          console.log(err);
          this.srvrSync = false;
        }
     );
      
  }

  async setSynced(inserted_id:any) {
    for (const id of inserted_id) {
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
