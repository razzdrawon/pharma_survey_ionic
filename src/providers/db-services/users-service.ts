// import { Injectable } from '@angular/core';
// import { SQLiteObject } from '@ionic-native/sqlite';

// /*
//   Generated class for the DBServiceProvider provider.

//   See https://angular.io/guide/dependency-injection for more info on providers
//   and Angular DI.
// */
// @Injectable()
// export class UsersDBService {

//   db: SQLiteObject = null;

//   constructor() {
//   }

//   setDatabase(db: SQLiteObject){
//     if(this.db === null){
//       this.db = db;
//     }
//   }

//   createUsersTable(){
//     let sql = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, completed INTEGER)';
//     return this.db.executeSql(sql, []);
//   }

//   dropTable(){
//     let sql = 'DROP TABLE IF EXISTS users';
//     return this.db.executeSql(sql, []);
//   }

//   getAllUsers(){
//     let sql = 'SELECT * FROM users';
//     return this.db.executeSql(sql, [])
//     .then(response => {
//       let users = [];
//       for (let index = 0; index < response.rows.length; index++) {
//         users.push( response.rows.item(index) );
//       }
//       return Promise.resolve( users );
//     })
//     .catch(error => Promise.reject(error));
//   }

//   getUserLogin(user: any){
//     console.log('user sent to the query: ' + user.username + ' ' + user.username);
//     let sql = 'SELECT * FROM users WHERE username=? AND password=?';
//     return this.db.executeSql(sql, [user.username, user.password])
//     .then(response => {
//       console.log('db response: ' + response);
//       let users = [];
//       for (let index = 0; index < response.rows.length; index++) {
//         users.push( response.rows.item(index) );
//       }
//       console.log('db users: ' + users);
//       return Promise.resolve( users );
//     })
//     .catch(error => Promise.reject(error));
//   }

//   createUser(user: any){
//     let sql = 'INSERT INTO users(username, password, completed) VALUES(?,?,?)';
//     return this.db.executeSql(sql, [user.username, user.password, user.completed]);
//   }

//   updateUser(user: any){
//     let sql = 'UPDATE users SET username=?, password=?, completed=? WHERE id=?';
//     return this.db.executeSql(sql, [user.username, user.password, user.completed, user.id]);
//   }

//   deleteUser(user: any){
//     let sql = 'DELETE FROM users WHERE id=?';
//     return this.db.executeSql(sql, [user.id]);
//   }

// }
