import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RevisionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 //import { FinCuestPage} from '../index.paginas';
@IonicPage()
@Component({
  selector: 'page-revision',
  templateUrl: 'revision.html',
})
export class RevisionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RevisionPage');
  }

  cambiar_pagina() {
    //this.navCtrl.setRoot(FinCuestPage);
  }

}
