import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class SyncHttpService {


  public headers: Headers;
  public getCSubtipo    ="getCSubtipo";
  public getCUsuario  ="getCUsuario";
  public getCVersionApp  ="getCVersionApp";
  public saveDCuestionario  ="saveDCuestionario";
  public getCMedicamento  ="getCMedicamento";
  public getCEstablecimiento  ="getCEstablecimiento";
  public getCCuestionarioHospital  ="getCCuestionarioHospital";
  public getCCuestionarioFarmacia  ="getCCuestionarioFarmacia";

  
 

  constructor(
    private http: HttpClient
  ) {

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');



  }

  public apiUrl  = 'http://www.accesosinexceso.org/';

  public version   ="0.9.1";

  getUsers() {
    return this.http.get('../assets/raw/usuarios.json')
    .map((res: any[]) => res);
  }

  getEstablishments() {
    return this.http.get('../assets/raw/establecimientos.json')
    .map((res: any[]) => res);
  }

  getHospitalSurvey() {
    let url =this.apiUrl +this.getCCuestionarioHospital;
    console.log("33333333333333333333333***********---"+url);
    return this.http.get(url)
    .map((res: any) => res);
  }

  getPharmaSurvey() {
    let url =this.apiUrl +this.getCCuestionarioFarmacia;

    console.log("33333333333333333333333***********---"+url);
    return this.http.get(url)
    .map((res: any) => res);
  }

  getMedicines() {
    return this.http.get('../assets/raw/medicamentos.json')
    .map((res: any[]) => res);
  }

  getSubtypes() {
    return this.http.get('../assets/raw/subtipos.json')
    .map((res: any[]) => res);
  }
  
/*


getUsers() {
  return this.http.get(this.apiUrl + this.getCUsuario )
  .map((res: any[]) => res);
}

getEstablishments() {
  return this.http.get(this.apiUrl + this.getCEstablecimiento )
  .map((res: any[]) => res);
}

getHospitalSurvey() {
  return this.http.get(this.apiUrl + this.getCCuestionarioHospital )
  .map((res: any[]) => res);
}

getPharmaSurvey() {
  return this.http.get(this.apiUrl + this.getCCuestionarioFarmacia)
  .map((res: any[]) => res);
}

getMedicines() {
  return this.http.get(this.apiUrl + this.getCMedicamento)
  .map((res: any[]) => res);
}

getSubtypes() {
  return this.http.get(this.apiUrl + this.getSubtypes) 
  .map((res: any[]) => res);
}


  getSaveSurvey(cuestionarios:any[]) {
    return this.http.post(this.apiUrl + this.saveDCuestionario ,cuestionarios,{
      headers: { 'Content-Type': 'application/json' }
    })
    .map((res: any[]) => res);
  }

  */

  getVersionApp() {
    let url =this.apiUrl + this.getCVersionApp+"/"+this.version;
    console.log("URL    ..................."+url);
    return this.http.get(url) 
    .map((res: any[]) => res);
  }
  
}