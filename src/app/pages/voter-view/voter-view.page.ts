import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare const window: any;

@Component({
  selector: 'app-voter-view',
  templateUrl: './voter-view.page.html',
  styleUrls: ['./voter-view.page.scss'],standalone: false
})
export class VoterViewPage implements OnInit {
  voterId: any;
  voter: any = null;
  loading: Boolean = true;
  constructor(private route: ActivatedRoute) {
    this.voterId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadVoter();
    }, 1500);
  }

  async loadVoter() {

    try {
      const data = await (window as any).electronAPI.getVoterById(this.voterId);
      if (data?.voter) {
        this.voter = JSON.parse(data.voter);
        this.voter.id = data.id; // preserve ID for Edit link
      }
    } catch (error) {
      console.error('Failed to load voter', error);
    }

    // let v:any = `{"name_en":"Sushant","name_hi":"anshu","mobile_no":"9876543210","gender":"male","dob":"2025-07-18","whatsapp_no":"8884234234","email":"sss@dfmfgh.gfhg","relative_name":"jhj","qualification":"ghfgh","graduation_university":"fghf","graduation_year":2016,"qualification_certificate_for":"hfghjhj","profession":"dfgg","additional_document":"dg","address":"jghj","house_no":"ghjghj","gali":"ghjghj","village_town":"ghjghj","post_office":"ghj","tehsil":"ghjghj","district":"mbnmbnm","area":"bn,m,g","vidhan_sabha_id":"","ward_id":"","mohalla_id":"","aadhaar_voter_id":"4234324"}`;
    // this.voter = JSON.parse(v);

    // this.voter = row ? JSON.parse(row.voter) : null;
  }

}
