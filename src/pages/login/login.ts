import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, AlertController,LoadingController } from 'ionic-angular';
import { DBService } from '../../providers/db-services/storage-service';
import { SyncHttpService } from '../../providers/http-services/sync-service';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import { SurveySummary } from '../../models/surveySummary';

import {Md5} from 'ts-md5';
import { JsonpCallbackContext } from '../../../node_modules/@angular/common/http/src/jsonp';





@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  allUsers: any[] = [];
  usersAsync: any[] = [];
  userLogin: { username: string; password: string; } = { username: '', password: '' };
  user: any;
  pass_hashed:any;
  public loading:any;
  public cuesTotal=0;
  public cuesSync=0;
  public cuesPen=0;
  //public summary:SurveySummary;

  tasks: any[] = [];
  constructor(public navCtrl: NavController,
   public db: DBService,
    public syncHttpService: SyncHttpService, public alertCtrl: AlertController, private storage: Storage,
     private loadingCtrl: LoadingController,
    //private iab: InAppBrowser
    
    ) {

      // this.storage.clear();
    }

  ionViewDidLoad() {

    // this.storage.remove('LoggedUser');
    /*this.db.selectSurveyStatus().then(summary => {
      if(summary != null) {
        console.log(summary);
       this.summary = summary;
      }
      console.log(summary);
    });
*/
    this.validateActiveSession();

    this.getAllUsers();

     this.obtieneSumatoriaCuestionarios();
  }


obtieneSumatoriaCuestionarios(){



  this.db.getSurveys().then(response => {
      
    for (let index = 0; index < response.rows.length; index++) {
      let obj = response.rows.item(index);
      console.log("Objeto base de datos"+ JSON.stringify( obj ) );
          this.cuesSync = obj.sync;
          this.cuesTotal = obj.tot;
          this.cuesPen = obj.notSync;       
    }
    });
}


  validateActiveSession() {
    this.storage.get('LoggedUser').then(user => {
      if(user != null) {
        console.log(user);
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
      }
      console.log(this.user);
    })
  }

  private showLoading(mensaje:string) {
    this.loading = this.loadingCtrl.create({
      content: mensaje+'...'
    });
    this.loading.present();
  }

  getAllUsers() {
    // set a key/value
    this.storage.get('users').then(users => {
      if(users != null) {
        this.allUsers = JSON.parse(users);
      }
      console.log(this.allUsers);
    });
  }

  // getAllUsers(){
  //   this.usersDBService.getAllUsers()
  //   .then(users => {
  //     this.allUsers = users;
  //   })
  //   .catch( error => {
  //     console.error( error );
  //   });
  // }

  runLogin() {



    let validUser = this.allUsers.find(user => user.usuario == this.userLogin.username
       && user.hashed_password == Md5.hashStr(this.userLogin.password)
      );



    if (validUser != null) {
      this.storage.set('LoggedUser', validUser);
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot();
    }
    else {
   
      let alert = this.alertCtrl.create({
        title: 'Credenciales Invalidas',
        message: 'Su usuario y/o contraseña son incorrectos.',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.userLogin = { username: this.userLogin.username, password: '' };
            }
          }
        ]
      });
      alert.present();
    }




  }


  showPrompt() {
    //solo si hay version
        

    this.syncHttpService.getVersionApp( )
    .subscribe(
      (data: any[]) => {
        console.log('getVersionApp'+JSON.stringify(data) );

        if(data != null &&   data.length>0) {
          let obj = data[0];
        
          
        let prompt = this.alertCtrl.create({
          title: 'Actualización',
          message: "Existe una actualización del sistema presione ok para descargarla o cancelar  para hacerlo mas tarde.",
          
          buttons: [
            {
              text: 'Cancelar',
            },
            {
              text: 'Ok',
              handler: data => {
               
              let options = "location=yes"
              let iab = new InAppBrowser();              
              iab.create(  obj.url, '_system',options);

              }
            }
          ]
        });
        prompt.present();
            
        
        }


          },
      err => {
        console.log('getVersionApp'+JSON.stringify(err));
      }
  );



      }


  syncInfo() {


    this.db.getSurveyToSync().then(response => {
      let cuesToSync=[];
      for (let index = 0; index < response.rows.length; index++) 
      {
        cuesToSync.push(response.rows.item(index));
      }



      this.syncHttpService.setSaveSurvey(cuesToSync).subscribe(
        (data: any[]) => {

          for (let index = 0; index < data.length; index++) 
          {
          
            if(data[index].response_code==0){
              this.db.markSurveySync(data[index]);
            }
            
          }

          
          this.obtieneSumatoriaCuestionarios();
        },
        err => {
          this.obtieneSumatoriaCuestionarios();
          console.log(JSON.stringify(err));
        }
    );

      

    });




    this.showLoading('Sincronizando información ...');
    setTimeout(() => {
      this.loading.dismiss();
      this.showPrompt();
    },10000);
     this.syncHttpService.getUsers()
      .subscribe(
        (data: any[]) => {
          console.log(JSON.stringify(data) );
          this.storage.remove('users');
          this.allUsers = data;
          // set a key/value
          this.storage.set('users', JSON.stringify(data));
          console.log('users syncronized');
          console.log('storage: ' + this.storage.get('users'));
          
        },
        err => {
          
          console.log(JSON.stringify(err));
        }
    );

    
    let estabsObs = this.syncHttpService.getEstablishments()
      .subscribe(
        (res: any[]) => {
          this.db.deleteEstablishment().then(data => {
          for(let i=0; res.length>i;i++) {
            let establishment = res[i];
           this.db.insertEstablishment(establishment); 
          }      
        });
        },
        err => {
          console.log(JSON.stringify(err));
        }       
    );

    let subsObs = this.syncHttpService.getSubtypes()
      .subscribe(
        (data: any[]) => {
          console.log(JSON.stringify("Subtypes --------------------*******-----"+data) );
          this.storage.remove('subtypes');
          // set a key/value
          this.storage.set('subtypes', JSON.stringify(data));
         

        },
        err => {
          console.log(JSON.stringify(err));
        }
    );

    let medsObs = this.syncHttpService.getMedicines()
      .subscribe(
        (data: any[]) => {
          console.log(JSON.stringify(data) );
          this.storage.remove('medicines');
          // set a key/value
          this.storage.set('medicines', JSON.stringify(data));
          console.log('medicines syncronized');
          console.log('storage: ' + this.storage.get('medicines'));

        },
        err => {
          console.log(JSON.stringify(err));
        }
    );

    let hospitalObs = this.syncHttpService.getHospitalSurvey()
      .subscribe(
        (data: any) => {
          console.log(JSON.stringify(data) );
          this.storage.remove('hospitalSurvey');
          // set a key/value
          this.storage.set('hospitalSurvey', JSON.stringify(data));
          console.log('hospitalSurvey syncronized');
          console.log('storage: ' + this.storage.get('hospitalSurvey'));

        },
        err => {
          console.log(JSON.stringify(err));
        }
    );

    let pharmaObs = this.syncHttpService.getPharmaSurvey()
      .subscribe(
        (data: any) => {
          console.log(''+JSON.stringify(data) );
          this.storage.remove('pharmaSurvey');
          // set a key/value
          this.storage.set('pharmaSurvey', JSON.stringify(data));
          console.log('pharmaSurvey syncronized');
          console.log('storage: ' + this.storage.get('pharmaSurvey'));

        },
        err => {
          console.log(JSON.stringify(err));
        }
    );

  }

  


}
