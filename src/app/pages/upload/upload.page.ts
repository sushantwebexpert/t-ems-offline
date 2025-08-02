import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
declare const window: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],standalone: false
})
export class UploadPage implements OnInit {

  voters: any = [];
  loading: Boolean = true;
  masterSync: Boolean = false;
  srvrSync: Boolean = false;
  syncmsg: any='';
  srvrMsg: any='';
  uploadedIds: any[] = [];
  constructor(private api: ApiService) { }

  ngOnInit() {
    setTimeout(() => {
      this.getAllVoters();
    }, 1500);
    let _id = localStorage.getItem('ems_inserted_id');
    if(_id){
      this.uploadedIds = JSON.parse(_id);
      console.log(this.uploadedIds);
    }
  }

  async getAllVoters() {
    (window as any).electronAPI.getVoters()
      .then((result:any) => {
          console.log(result);
          if(result) {
                result.forEach((row:any) => {
                  try {
                    const voter = JSON.parse(row.voter);
                    this.voters.push({ id: row.id, ...voter });
                  } catch (e) {
                    console.error(`Invalid JSON for ID ${row.id}`, e);
                  }
                });
                this.loading = false;
          }
      })
      .catch((err:any) => {
        console.error('Insert Error:', err);
        alert('Somthing went wrong!');
        this.loading = false;
      });
  }

  getMasters() {
    this.masterSync = true;
    this.syncmsg = '';
    this.api.getMasters().subscribe(
      async (data:any) => {
        console.log(data);
        await (window as any).electronAPI.insertMasterData(data);
        this.masterSync = false;
        this.syncmsg = 'Master data updated successfully!!!';
      },
      (err:any) => {
        console.log(err);
        this.masterSync = false;
      }
    );
  }

  syncToServer() {
    this.srvrSync = true;
    this.srvrMsg = '';

    // this.voters.forEach((item :any, index :any) => {
    // console.log(item);
    console.log(this.voters);


      this.api.saveVoterData(this.voters).subscribe(
        async (data:any) => {
          console.log(data);
          this.srvrSync = false;
          this.srvrMsg = data.message;
          this.uploadedIds = data.inserted_id;
          localStorage.setItem('ems_inserted_id', JSON.stringify(this.uploadedIds));
        },
        (err:any) => {
          console.log(err);
          this.srvrSync = false;
        }
      );
      
    // });

// imagine I have a list of data to upload to server in angular app. 

// 1. on the upload page what strategy should I follow to send data to server?
// 2. How can I mark the list which data has been uploaded it=f we are going one by one.
// 3. Or, how can I show number of data have been uploaded if we are going bulk.
  }

  isUploaded(id: number): boolean {
    return this.uploadedIds.includes(id);
  }
}
