import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UsersDBService } from './../../providers/db-services/users-service';
import { UsersHttpService } from '../../providers/http-services/users-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  allUsers: any[] = [];
  usersAsync: any[] = [];
  userLogin: { username: string; password: string;} = { username: '', password: ''};

  constructor(public navCtrl: NavController, public usersDBService: UsersDBService, public usersHttpService: UsersHttpService, public alertCtrl: AlertController) {
  }

  ionViewDidLoad(){
    this.getAllUsers();
  }

  logForm() {
    this.validateLogin();
  }

  validateLogin() {
    this.usersDBService.getUserLogin(this.userLogin)
    .then(users => {
      if(users.length > 0) {
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
      }
      else{
        let alert = this.alertCtrl.create({
          title: 'Credenciales Invalidas',
          message: 'Su usuario y/o contraseña son incorrectos.',
          buttons: [
            {
              text: 'Aceptar',
              handler: () => {
                this.userLogin = { username: '', password: ''};
              }
            }
          ]
        });
        alert.present();
      }
    })
    .catch( error => {
      console.error( error );
    });
  }

  syncInfo() {
    this.usersHttpService.getUsers();
    
  }

  getAllUsers(){
    this.usersDBService.getAllUsers()
    .then(users => {
      this.allUsers = users;
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
            this.usersDBService.createUser(data)
            .then(response => {
              this.allUsers.unshift( data );
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
    this.usersDBService.updateUser(user)
    .then( response => {
      this.allUsers[index] = user;
    })
    .catch( error => {
      console.error( error );
    })
  }

  deleteUser(user: any, index){
    this.usersDBService.deleteUser(user)
    .then(response => {
      console.log( response );
      this.allUsers.splice(index, 1);
    })
    .catch( error => {
      console.error( error );
    })
  }

}

