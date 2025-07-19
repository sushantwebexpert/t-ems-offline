import { Component, OnInit } from '@angular/core';
declare const window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],standalone: false
})
export class HomePage implements OnInit {
  voters: any = [];
  loading: Boolean = true;
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.getAllVoters();

      // let _m = '{"name_en":"Sushant","name_hi":"anshu","mobile_no":"9876543210","gender":"male","dob":"2025-07-18","whatsapp_no":"8884234234","email":"sss@dfmfgh.gfhg","relative_name":"jhj","qualification":"ghfgh","graduation_university":"fghf","graduation_year":2016,"qualification_certificate_for":"hfghjhj","profession":"dfgg","additional_document":"dg","address":"jghj","house_no":"ghjghj","gali":"ghjghj","village_town":"ghjghj","post_office":"ghj","tehsil":"ghjghj","district":"mbnmbnm","area":"bn,m,g","vidhan_sabha_id":"","ward_id":"","mohalla_id":"","aadhaar_voter_id":"4234324"}';
      // let vv = JSON.parse(_m);
      // this.voters.push({id:1, ...vv});
      // this.voters.push({id:2, ...vv});
      // this.voters.push({id:3, ...vv});
      // this.voters.push({id:4, ...vv});
      // this.voters.push({id:5, ...vv});
      // this.voters.push({id:6, ...vv});
      // this.loading = false;



    }, 1500);
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
              console.log(this.voters);

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
