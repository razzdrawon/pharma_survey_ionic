import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { LoginPage } from './../login/login';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DBService } from '../../providers/db-services/storage-service';
/**
 * 
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

  public image: string = null;
  public establishmentId: number = 0;
  public type: number = 0;
  constructor(public navCtrl: NavController,  private storage: Storage,private camera: Camera,private dbService: DBService,    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinCuestPage');

    this.establishmentId = this.navParams['data'].establishmentId;
    this.type = this.navParams['data'].type;
  }

  cambiar_pagina() {


    this.dbService.updateAnswersSurveyImage(   this.establishmentId, this.type,this.image);


    this.storage.remove('LoggedUser');
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

  getPicture() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camera.getPicture(options)
      .then(imageData => {
        this.image = `data:image/jpeg;base64,${imageData}`;
       
      })
      .catch(error => {
        console.error(error);
      });
  }

}
