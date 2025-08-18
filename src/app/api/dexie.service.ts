import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface District {
  id: string;
  name_en: string;
  name_hi: string;
}

export interface VidhanSabha {
  id: string;
  district_id: string;
  vidhan_sabha_number: string;
  name_en: string;
  name_hi: string;
}

export interface Ward {
  id: string;
  vidhan_sabha_id: string;
  district_id: string;
  name_en: string;
  name_hi: string;
}

export interface Mohalla {
  id: string;
  ward_id: string;
  vidhan_sabha_id: string;
  name_en: string;
  name_hi: string;
  area: string;
}

export interface Voter {
  id?: number;
  name_en: string;
  name_hi: string;
  mobile_no: string;
  gender: string;
  dob: string;
  whatsapp_no?: string;
  email?: string;
  relative_name?: string;
  qualification?: string;
  graduation_university?: string;
  graduation_year?: string;
  qualification_certificate_for?: string;
  profession?: string;
  additional_document?: string;
  address?: string;
  house_no?: string;
  gali?: string;
  village_town?: string;
  post_office?: string;
  tehsil?: string;
  district?: string;
  area?: string;
  vidhan_sabha_id?: string;
  ward_id?: string;
  mohalla_id?: string;
  aadhaar_voter_id?: string;
  photo_file?: string;
  graduation_file?: string;
  aadhaar_file?: string;
  aadhaar2_file?: string;
  voterid_file?: string;
  voterid2_file?: string;
  voter_uid?: string;
  is_synced?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {
  districts!: Table<District>;
  vidhan_sabhas!: Table<VidhanSabha>;
  wards!: Table<Ward>;
  mohallas!: Table<Mohalla>;
  voters!: Table<Voter, number>;

  constructor() {
      super('votersDB');

      this.version(1).stores({
        districts: 'id, name_en, name_hi',
        vidhan_sabhas: 'id, district_id, vidhan_sabha_number, name_en, name_hi',
        wards: 'id, vidhan_sabha_id, district_id, name_en, name_hi',
        mohallas: 'id, ward_id, vidhan_sabha_id, name_en, name_hi, area',
        voters: '++id, mobile_no, voter_uid, vidhan_sabha_id, ward_id, mohalla_id, is_synced',
      });

      this.districts = this.table('districts');
      this.vidhan_sabhas = this.table('vidhan_sabhas');
      this.wards = this.table('wards');
      this.mohallas = this.table('mohallas');
      this.voters = this.table('voters');
  }
}