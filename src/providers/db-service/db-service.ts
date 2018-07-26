import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DBServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DBServiceProvider {

  db: SQLiteObject = null;

  constructor() {
  }

  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
    let sql = 'CREATE TABLE IF NOT EXISTS userss(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, completed INTEGER)';
    return this.db.executeSql(sql, []);
  }

  getAll(){
    let sql = 'SELECT * FROM userss';
    return this.db.executeSql(sql, [])
    .then(response => {
      let users = [];
      for (let index = 0; index < response.rows.length; index++) {
        users.push( response.rows.item(index) );
      }
      return Promise.resolve( users );
    })
    .catch(error => Promise.reject(error));
  }

  create(user: any){
    let sql = 'INSERT INTO userss(username, password, completed) VALUES(?,?,?)';
    return this.db.executeSql(sql, [user.username, user.password, user.completed]);
  }

  update(user: any){
    let sql = 'UPDATE userss SET username=?, password=?, completed=? WHERE id=?';
    return this.db.executeSql(sql, [user.username, user.password, user.completed, user.id]);
  }

  delete(user: any){
    let sql = 'DELETE FROM userss WHERE id=?';
    return this.db.executeSql(sql, [user.id]);
  }

}
