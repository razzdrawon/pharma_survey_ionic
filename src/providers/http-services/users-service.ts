import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersHttpService {

  constructor(
    private http: HttpClient
  ) {}

  apiUrl = 'https://jsonplaceholder.typicode.com';

  getUsers() {
    return new Promise((resolve, reject) => {
      this.http.get('../assets/raw/users.json')
      .subscribe(response => {
        let users = response as any[];
        users.forEach(element => {
          console.log(element.username);
          console.log(element.password);
        });
        
        resolve(users);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  // getUsers() {
  //   return this.http.get('../assets/raw/users.json')
  //   .map(res => res);
  // }
  
}