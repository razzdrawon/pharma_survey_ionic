import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersHttpService {

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
    this.http.get('../assets/raw/users.json')
    .map(res => res)
    .subscribe(
      (data: any[]) => {
        let users = data;
        console.log(users);
        users.forEach(element => {
          console.log(element.username);
          console.log(element.password);
        });
      },
      err => {
        console.log(err);
      }
    );
  }
  
}