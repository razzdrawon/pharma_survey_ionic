import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DBServiceProvider } from './../../providers/db-service/db-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  users: any[] = [];

  constructor(public navCtrl: NavController, public dbService: DBServiceProvider, public alertCtrl: AlertController,) {

  }

  ionViewDidLoad(){
    this.getAllUsers();
  }
  
  user1 = {user: 'user1', password: 'password1'}
  
  logForm() {
    
    console.log(this.user1);
    // this.navCtrl.push(HomePage)
    // .then(() => {
    //   const startIndex = this.navCtrl.getActive().index - 1;
    //   this.navCtrl.remove(startIndex, 1);
    // });

    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot();
  }

  getAllUsers(){
    this.dbService.getAll()
    .then(users => {
      this.users = users;
    })
    .catch( error => {
      console.error( error );
    });
  }

  openAlertNewUser(){
    let alert = this.alertCtrl.create({
      title: 'Crear Usuario',
      message: 'escribe el nombre del usuario',
      inputs: [
        {
          name: 'username',
          placeholder: 'Insertar usuario',
        },
        {
          name: 'password',
          placeholder: 'Insertar contraseña',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () =>{
            console.log('cancelar');
          }
        },
        {
          text: 'Crear',
          handler: (data)=>{ 
            data.completed = false;
            this.dbService.create(data)
            .then(response => {
              this.users.unshift( data );
            })
            .catch( error => {
              console.error( error );
            })
          }
        }
      ]
    });
    alert.present();
  }

  updateUser(user, index){
    user = Object.assign({}, user);
    user.password = !user.password;
    this.dbService.update(user)
    .then( response => {
      this.users[index] = user;
    })
    .catch( error => {
      console.error( error );
    })
  }

  deleteUser(user: any, index){
    this.dbService.delete(user)
    .then(response => {
      console.log( response );
      this.users.splice(index, 1);
    })
    .catch( error => {
      console.error( error );
    })
  }

}

