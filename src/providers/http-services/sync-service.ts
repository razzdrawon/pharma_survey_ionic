import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SyncHttpService {

  constructor(
    private http: HttpClient
  ) {}

  apiUrl = 'http://216.154.221.48/getCUsuario';

  // getUsers() {
  //   return new Promise((resolve, reject) => {
  //     // this.http.get('../assets/raw/users.json')
  //     this.http.get(this.apiUrl)
  //     .subscribe((res: Response) => {        
  //       let users = res.headers;
  //       console.log('res: ' + users);
  //       resolve(users);
  //     }, err => {
  //       console.log('error: ' + err.status);
  //       reject(err);
  //     });
  //   });
  // }

  getUsers() {
    return this.http.get('../assets/raw/usuarios.json')
    .map((res: any[]) => res);
  }

  getEstablishments() {
    return this.http.get('../assets/raw/establecimientos.json')
    .map((res: any[]) => res);
  }

  getHospitalSurvey() {
    return this.http.get('../assets/raw/questionarioHospital.json')
    .map((res: any[]) => res);
  }

  getMedicines() {
    return this.http.get('../assets/raw/medicamentos.json')
    .map((res: any[]) => res);
  }

  getSubtypes() {
    return this.http.get('../assets/raw/subtipos.json')
    .map((res: any[]) => res);
  }
}