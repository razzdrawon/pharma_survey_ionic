import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
//import { UsersDBService } from './../../providers/db-services/users-service';
import { SyncHttpService } from '../../providers/http-services/sync-service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  allUsers: any[] = [];
  usersAsync: any[] = [];
  userLogin: { username: string; password: string; } = { username: '', password: '' };
  user: any;

  constructor(public navCtrl: NavController,
    //public usersDBService: UsersDBService, 
    public syncHttpService: SyncHttpService, public alertCtrl: AlertController, private storage: Storage) {

      // this.storage.clear();
  }

  ionViewDidLoad() {

    // this.storage.remove('LoggedUser');
    
    this.validateActiveSession();

    this.getAllUsers();
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
      // && user.password == this.userLogin.password
      );
    if (validUser != null) {
      this.storage.set('LoggedUser', validUser);
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot();
    }
    else {
      console.log('user invalid: ' + this.userLogin.username);
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


    // this.usersDBService.getUserLogin(this.userLogin)
    // .then(users => {
    //   if(users.length > 0) {
    //     this.navCtrl.setRoot(HomePage);
    //     this.navCtrl.popToRoot();
    //   }
    //   else{
    //     let alert = this.alertCtrl.create({
    //       title: 'Credenciales Invalidas',
    //       message: 'Su usuario y/o contraseña son incorrectos.',
    //       buttons: [
    //         {
    //           text: 'Aceptar',
    //           handler: () => {
    //             this.userLogin = { username: '', password: ''};
    //           }
    //         }
    //       ]
    //     });
    //     alert.present();
    //   }
    // })
    // .catch( error => {
    //   console.error( error );
    // });

  }

  syncInfo() {

    this.syncHttpService.getUsers()
      .subscribe(
        (data: any[]) => {
          console.log(data);
          this.storage.remove('users');
          this.allUsers = data;
          // set a key/value
          this.storage.set('users', JSON.stringify(data));
          console.log('users syncronized');
          console.log('storage: ' + this.storage.get('users'));

        },
        err => {
          console.log(err);
        }
    );
    
    this.syncHttpService.getEstablishments()
      .subscribe(
        (data: any[]) => {
          console.log(data);
          this.storage.remove('establishments');
          // set a key/value
          this.storage.set('establishments', JSON.stringify(data));
          console.log('establishments syncronized');
          console.log('storage: ' + this.storage.get('establishments'));

        },
        err => {
          console.log(err);
        }
    );

    this.syncHttpService.getSubtypes()
      .subscribe(
        (data: any[]) => {
          console.log(data);
          this.storage.remove('subtypes');
          // set a key/value
          this.storage.set('subtypes', JSON.stringify(data));
          console.log('subtypes syncronized');
          console.log('storage: ' + this.storage.get('subtypes'));

        },
        err => {
          console.log(err);
        }
    );

    this.syncHttpService.getMedicines()
      .subscribe(
        (data: any[]) => {
          console.log(data);
          this.storage.remove('medicines');
          // set a key/value
          this.storage.set('medicines', JSON.stringify(data));
          console.log('medicines syncronized');
          console.log('storage: ' + this.storage.get('medicines'));

        },
        err => {
          console.log(err);
        }
    );

    this.syncHttpService.getHospitalSurvey()
      .subscribe(
        (data: any[]) => {
          console.log(data);
          this.storage.remove('hospitalSurvey');
          // set a key/value
          this.storage.set('hospitalSurvey', JSON.stringify(data));
          console.log('hospitalSurvey syncronized');
          console.log('storage: ' + this.storage.get('hospitalSurvey'));

        },
        err => {
          console.log(err);
        }
    );

    this.syncHttpService.getPharmaSurvey()
      .subscribe(
        (data: any[]) => {
          console.log(data);
          this.storage.remove('pharmaSurvey');
          // set a key/value
          this.storage.set('pharmaSurvey', JSON.stringify(data));
          console.log('pharmaSurvey syncronized');
          console.log('storage: ' + this.storage.get('pharmaSurvey'));

        },
        err => {
          console.log(err);
        }
    );

  }

  

  

  // openAlertNewUser(){
  //   let alert = this.alertCtrl.create({
  //     title: 'Crear Usuario',
  //     message: 'escribe el nombre del usuario',
  //     inputs: [
  //       {
  //         name: 'username',
  //         placeholder: 'Insertar usuario',
  //       },
  //       {
  //         name: 'password',
  //         placeholder: 'Insertar contraseña',
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         handler: () =>{
  //           console.log('cancelar');
  //         }
  //       },
  //       {
  //         text: 'Crear',
  //         handler: (data)=>{ 
  //           data.completed = false;
  //           this.usersDBService.createUser(data)
  //           .then(response => {
  //             this.allUsers.unshift( data );
  //           })
  //           .catch( error => {
  //             console.error( error );
  //           })
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // updateUser(user, index){
  //   user = Object.assign({}, user);
  //   user.password = !user.password;
  //   this.usersDBService.updateUser(user)
  //   .then( response => {
  //     this.allUsers[index] = user;
  //   })
  //   .catch( error => {
  //     console.error( error );
  //   })
  // }

  // deleteUser(user: any, index){
  //   this.usersDBService.deleteUser(user)
  //   .then(response => {
  //     console.log( response );
  //     this.allUsers.splice(index, 1);
  //   })
  //   .catch( error => {
  //     console.error( error );
  //   })
  // }

}

