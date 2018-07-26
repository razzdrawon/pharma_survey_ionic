import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsersHttpService {

  constructor(
    private http: HttpClient
  ) {}

  apiUrl = 'https://jsonplaceholder.typicode.com';

  getUsers() {
    return new Promise(resolve => {
      this.http.get('../assets/raw/users.json')
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}