import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';


declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private db: DexieService) {}

  async insertMasterData(masterData: any[]) {
    try {
      await this.db.transaction('rw', this.db.districts, this.db.vidhan_sabhas, this.db.wards, this.db.mohallas, async () => {
        for (const district of masterData) {
          await this.db.districts.put({
            id: district.district_id,
            name_en: district.district_name_en,
            name_hi: district.district_name_hi,
          });

          for (const vs of district.vidhan_sabhas || []) {
            await this.db.vidhan_sabhas.put({
              id: vs.vidhan_sabha_id,
              district_id: district.district_id,
              vidhan_sabha_number: vs.vidhan_sabha_number,
              name_en: vs.vidhan_sabha_name_en,
              name_hi: vs.vidhan_sabha_name_hi,
            });

            for (const ward of vs.wards || []) {
              await this.db.wards.put({
                id: ward.ward_id,
                vidhan_sabha_id: vs.vidhan_sabha_id,
                district_id: district.district_id,
                name_en: ward.ward_name_en,
                name_hi: ward.ward_name_hi,
              });

              for (const mohalla of ward.mohallas || []) {
                await this.db.mohallas.put({
                  id: mohalla.mohalla_id,
                  ward_id: ward.ward_id,
                  vidhan_sabha_id: vs.vidhan_sabha_id,
                  name_en: mohalla.mohalla_name_en,
                  name_hi: mohalla.mohalla_name_hi,
                  area: mohalla.mohalla_area,
                });
              }
            }
          }
        }
      });

      console.log('Master data inserted successfully.');
    } catch (err) {
      console.error('Dexie Insert Error:', err);
    }
  }

  async getAllDB() {
    const districtCount = await this.db.districts.count();
    const vsCount = await this.db.vidhan_sabhas.count();
    const wardCount = await this.db.wards.count();
    const mohallaCount = await this.db.mohallas.count();
    const isMasterDataLoaded = districtCount > 0 && vsCount > 0 && wardCount > 0 && mohallaCount > 0;
    console.log(isMasterDataLoaded ? 'All master data loaded' : 'Master data incomplete');
    return isMasterDataLoaded;
  }

  async getDistricts() {
    const allDistricts = await this.db.districts.toArray();
    if(allDistricts) {
      return allDistricts;
    }
    return [];
  }

  async getVidhanSabhas(dID: any) {
    const vidhanSabhas = await this.db.vidhan_sabhas
          .where('district_id')
          .equals(dID)
          .toArray();
    if(vidhanSabhas) {
      return vidhanSabhas;
    }
    return [];
  }

  async getWards(vID: any) {
    const wards = await this.db.wards
          .where('vidhan_sabha_id')
          .equals(vID)
          .toArray();
    if(wards) {
      return wards;
    }
    return [];
  }

  async getWardsByDistric(dID: any) {
    const wards = await this.db.wards
          .where('district_id')
          .equals(dID)
          .toArray();
    if(wards) {
      return wards;
    }
    return [];
  }

  async getMohallas(wID: any) {
    const mohallas = await this.db.mohallas
          .where('ward_id')
          .equals(wID)
          .toArray();
    if(mohallas) {
      return mohallas;
    }
    return [];
  }

  async saveVoter(formData: any) {
    try {
      const id = await this.db.voters.add(formData);
      console.log('Voter added with ID:', id);
      return id;
    } catch (error) {
      console.error('Failed to add voter:', error);
      throw error;
    }
  }

  async getAllVoters(): Promise<any[]> {
    const voters = await this.db.voters.toArray();
    if(voters) {
      return voters;
    }
    return [];
  }

  async getAllVotersBySynced(synced: any): Promise<any[]> {
    const voters = await this.db.voters.where('is_synced').equals(synced).toArray();
    if(voters) {
      return voters;
    }
    return [];
  }

  async getVoterByID(id: any): Promise<any> {
    const voters = await this.db.voters.get(id);
    if(voters) {
      return voters;
    }
    return false;
  }

  async updateVoter(id: any, updatedData: any): Promise<any> {
    try {
      const updatedCount = await this.db.voters.update(id, updatedData);
      if (updatedCount === 0) {
        console.warn(`No voter found with ID ${id}`);
        return false;
      }
      console.log(`Voter with ID ${id} updated successfully`);
      return true;
    } catch (error) {
      console.error('Error updating voter:', error);
      return false;
    }
  }

  async getNameById(table: any, tID: any): Promise<any | undefined> {
    const table2Get = this.db.table<any, number>(table);
    const tName = await table2Get
          .where('id')
          .equals(tID)
          .first();
    if(tName) {
      return tName;
    }
    return false;
  }

  async updateVoterBySynced(id: any, synced: any): Promise<any> {
    try {
      const updatedCount = await this.db.voters.update(id, { is_synced: synced });
      if (updatedCount === 0) {
        console.warn(`No voter found with ID ${id}`);
        return false;
      }
      console.log(`Voter with ID ${id} updated successfully`);
      return true;
    } catch (error) {
      console.error('Error updating voter:', error);
      return false;
    }
  }

  /**** Delete ****/
  async deleteVoterByID(id: any): Promise<any> {
    return await this.db.voters.delete(id);
  }
}
