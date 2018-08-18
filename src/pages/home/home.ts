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
   
     this.establishmentSelected =est;
     this.establishmentsList= [];
     this.establishmentsList.push(est);
  

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
    let tasks = [];
    this.db.selectEstablishmentByName(this.findInput).then(response => {
      
      for (let index = 0; index < response.rows.length; index++) {
        let obj = response.rows.item(index);
        tasks.push({establecimiento_id: obj.id ,nombre: obj.name,tipo_establecimiento_id: obj.type });
      }
      });
      
      this.establishmentsList=tasks;
    
  

  }

  loadSubtypes() {
    this.storage.get('subtypes').then(
      (data) => {
        this.subtypes = JSON.parse(data);
        
        console.log("JKson sfringyfy  "+JSON.stringify(this.subtypes));
        console.log(this.subtypes);
         let varType =this.establishmentSelected.tipo_establecimiento_id;

          var subtypesArray = this.subtypes.filter(function(subtype, i) {
            return (subtype.tipo_establecimiento_id == varType);
          })
      
          this.subtypesArray  = subtypesArray ;
       
      },
      err => {
        console.log(err);
      }
    );
  }



  subtypeChanged() {

   // let item = this.establishmentSelected; // Just did this in order to avoid changing the next lines of code :P
    console.log("Subtipo seleccionado"+JSON.stringify( this.subtypeSelected));
  }

  startSurvey() {


    // console.log("subtype selected"+JSON.stringify(this.subtypeSelected));
    // console.log("establishment"+JSON.stringify(this.establishmentSelected));

      let params = Object.assign({}, this.subtypeSelected,this.establishmentSelected) ;
     
      this.navCtrl.push(SurveyPage, params ).then(() => {
        let index = this.navCtrl.length()-2;
        this.navCtrl.remove(index);
      });

  }

  salir() {
    this.storage.remove('LoggedUser');
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

}