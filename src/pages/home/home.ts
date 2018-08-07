import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SurveyPage } from '../survey/survey';
import { Storage } from '@ionic/storage';
import { DBService } from '../../providers/db-services/storage-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public loggedUser: any = {};

  public establishments: any[] = [];
  public establishmentsList: any[] = [];
  public subtypes: any[] = [];

  public establishmentSelected: any = {};
  public subtypeSelected: any = {};
  public subtypesArray: any[] = [];
  public findInput="";

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private storage: Storage, public alertCtrl: AlertController,
  private db:DBService
) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    this.validateLoggedUser();

    this.loadEstablishments();

  }

  setFilteredItems(event){

      if(this.findInput.length>3){
        this.loadEstablishments();

      }else{

        this.establishmentsList = this.establishments;
      }

  }


  selectEstablishment(est){
    console.log('entra establishment');
    console.log(est);
     this.establishmentSelected =est;
     this.establishmentsList= [];
     this.establishmentsList.push(est);
     this.optionChanged();

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


    this.db.selectEstablishmentByName(this.findInput).then(response => {
      let tasks = [];
      
 
      for (let index = 0; index < response.rows.length; index++) {
        let obj = response.rows.item(index);
        tasks.push({establecimiento_id: obj.id ,nombre: obj.name,tipo_establecimiento_id: obj.type });
      }
      
      this.establishmentsList=tasks;
    });
  

  }

  loadSubtypes() {
    this.storage.get('subtypes').then(
      (data) => {
        //console.log(data);
        this.subtypes = JSON.parse(data);

     
        //establishmentSelected.tipo_establecimiento_id
      


         let varType =this.establishmentSelected.tipo_establecimiento_id;
          var subtypesArray = this.subtypes.filter(function(subtype, i) {
            return (subtype.tipo_establecimiento_id == varType);
          })
          console.log(subtypesArray);
          this.subtypesArray  = subtypesArray ;
          console.log(this.subtypesArray);
      },
      err => {
        console.log(err);
      }
    );
  }

  optionChanged() {

 
    this.loadSubtypes();
  }

  subtypeChanged() {

   // let item = this.establishmentSelected; // Just did this in order to avoid changing the next lines of code :P
    console.log(this.subtypeSelected);
  }

  startSurvey() {

    // if( JSON.stringify(this.establishmentSelected) == '{}'   || this.establishmentSelected.tipo_establecimiento_id == 1)  {
    //   let alert = this.alertCtrl.create({
    //     title: 'Ingrese los campos requeridos',
    //     subTitle: 'Aseguresé de que ha introducido un establecimiento',
    //     buttons: ['Ok']
    //   });
    //   alert.present();
    // }

    // else if( JSON.stringify(this.establishmentSelected) != '{}' && JSON.stringify(this.subtypeSelected) == '{}') {
    //   let alert = this.alertCtrl.create({
    //     title: 'Ingrese los campos requeridos',
    //     subTitle: 'Aseguresé de que ha introducido un subtipo',
    //     buttons: ['Ok']
    //   });
    //   alert.present();
    // }

    // else{

    console.log(this.subtypeSelected);


      let params = Object.assign({}, this.subtypeSelected,this.establishmentSelected,this.loggedUser);
      console.log(params);
      this.navCtrl.push(SurveyPage, params );
    // }
  }

  salir() {
    this.storage.remove('LoggedUser');
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

}
