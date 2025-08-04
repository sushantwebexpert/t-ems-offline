import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../api/storage.service';

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


  constructor(private route: ActivatedRoute, private storage: StorageService) {
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

}
