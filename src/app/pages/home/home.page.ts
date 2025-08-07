import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../api/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],standalone: false
})
export class HomePage implements OnInit {
  voters: any = [];
  loading: Boolean = true;
  constructor(private storage: StorageService) { }

  ngOnInit() {
    setTimeout(() => {
      this.getAllVoters();
    }, 1500);
  }

  async getAllVoters() {
    // this.storage.getAllVoters()
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
        alert('Somthing went wrong!');
        this.loading = false;
      });
  }
}
