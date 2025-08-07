import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apiUrl: any = 'https://ems.awanish.in/api';

  constructor(private http: HttpClient) { }

  public login(email: any, password:any) {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    return this.http.post(`${this.apiUrl}/login_via_app`, data);
  }

  public saveVoterData(userData: any) {
    let district = 'lucknow';
    let _dis = localStorage.getItem('ems_app_user_district');
    if(_dis) {
      district = _dis;
    }
    const formData = new FormData();
    formData.append('voters', JSON.stringify(userData));
    formData.append('district', district);
    return this.http.post(`${this.apiUrl}/syncvoters`, formData);
  }

  public getMasters() {
    return this.http.get(`${this.apiUrl}/masters`);
    //return this.http.get(`https://awanish.in/api/get_district`);
  }

}
