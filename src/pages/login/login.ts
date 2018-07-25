import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

  }

  user = {user: 'user1', password: 'password1'}
  logForm() {
    console.log(this.user)
  }

}
