import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SurveyPage } from '../survey/survey';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public loggedUser: any = {};

  public establishments: any[] = [];
  public subtypes: any[] = [];

  public establishmentSelected: any = {};
  public subtypeSelected: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    this.validateLoggedUser();

    this.loadEstablishments();

    this.loadSubtypes();
    
  }

  validateLoggedUser() {
    this.storage.get('LoggedUser').then(
      (user) => {
        if (user) {
          this.loggedUser = user;
          console.log(this.loggedUser);
        }
        else {
          this.navCtrl.setRoot(LoginPage);
          this.navCtrl.popToRoot();
        }
      },
      error => {
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.popToRoot();
      }
    );
  }

  loadEstablishments() {
    this.storage.get('establishments').then(
      (data) => {
        //console.log(data);
        this.establishments = JSON.parse(data);
      },
      err => {
        console.log(err);
      }
    );
  }

  loadSubtypes() {
    this.storage.get('subtypes').then(
      (data) => {
        //console.log(data);
        this.subtypes = JSON.parse(data);
      },
      err => {
        console.log(err);
      }
    );
  }

  optionChanged() {

    console.log(this.establishmentSelected.establecimiento_id);

  }

  subtypeChanged() {

    console.log(this.subtypeSelected);

    // let item = this.establishmentSelected; // Just did this in order to avoid changing the next lines of code :P

  }

  startSurvey() {
    this.navCtrl.push(SurveyPage);
  }

  salir() {
    this.storage.remove('LoggedUser');
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

}
