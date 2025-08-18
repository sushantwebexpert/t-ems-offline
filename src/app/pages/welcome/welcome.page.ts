import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { StorageService } from '../../api/storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],standalone: false
})
export class WelcomePage implements OnInit {
  voters: any = [];
  loading: Boolean = true;
  masterSync: Boolean = false;
  srvrSync: Boolean = false;
  syncmsg: any='';
  srvrMsg: any='';
  uploadedIds: any[] = [];
  masterData: Boolean = false;

  cleaning: Boolean = false;
  cleanedDB: Boolean = true;

  public appPages = [
    { title: 'Add New Voter', url: '/voter-add', icon: 'person-add' },
    { title: 'Sync to Server', url: '/upload', icon: 'cloud-upload' },
    { title: 'Voters List', url: '/home', icon: 'list' }
  ];
  constructor(private api: ApiService, private storage: StorageService) { }

  ngOnInit() {
    this.checkDB();
    this.checkCleanDB();
  }

  async checkDB() {
    let _masterData:any = await this.storage.getAllDB();
    if(_masterData) {
      this.masterData = true;
    } else {
      this.masterData = false;
    }
    console.log(_masterData);
  }

  async checkCleanDB() {
     this.storage.getAllVotersBySynced(0)
      .then((result:any) => {
          if(result) {
            this.cleanedDB = false;
          }
      })
  }


  getMasters() {
    this.masterSync = true;
    this.syncmsg = '';
    this.api.getMasters().subscribe(
      async (data:any) => {
        console.log(data);
        await this.storage.insertMasterData(data);
        this.masterSync = false;
        this.syncmsg = 'Master data updated successfully!!!';
        this.checkDB();
      },
      (err:any) => {
        console.log(err);
        this.masterSync = false;
      }
    );
  }

  cleanDB() {
    this.cleaning = true;

    setTimeout(() => {


           this.storage.getAllVotersBySynced(1)
      .then((result:any) => {
          console.log(result);
          if(result) {
 
            for (const v of result) {
              console.log(v);
              
                // this.storage.deleteVoterByID(v.id);
              }
              this.cleaning = false;
              this.checkCleanDB();
          }
      })
      .catch((err:any) => {
        console.error('Insert Error:', err);
        alert('Somthing went wrong!');
        this.cleaning = false;
      });


      
    }, 90000);


  }

}
