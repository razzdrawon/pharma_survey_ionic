import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular/umd';
import { LoginPage } from '../login/login';
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

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinCuestPage');
  }

  cambiar_pagina() {
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

}
