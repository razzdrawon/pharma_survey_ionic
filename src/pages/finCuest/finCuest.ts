import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from './../login/login';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the FinCuestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */




@Component({
  selector: 'page-fin-cuest',
  templateUrl: 'finCuest.html',
})
export class FinCuestPage {

  constructor(public navCtrl: NavController,  private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinCuestPage');
  }

  cambiar_pagina() {
    this.storage.remove('LoggedUser');
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

}
