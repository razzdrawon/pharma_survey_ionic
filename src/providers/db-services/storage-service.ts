import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
//import { Survey } from '../../models/survey';
//import { SurveySummary } from '../../models/surveySummary';
import { SQLite } from '@ionic-native/sqlite';
// /*
//   Generated class for the DBServiceProvider provider.

//   See https://angular.io/guide/dependency-injection for more info on providers
//   and Angular DI.
// */



@Injectable()
 export class DBService {


  DB_NAME: string = 'unodc_ase';

   constructor( public sqlite: SQLite) {
  }

  configureDatabase() {
    this.createEstablishmentTable();
    this.createSurveyTable();
  }

  query(query: string, params: any[] = []) {
  return this.sqlite.create({
    name: this.DB_NAME,
    location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql(query, params).catch(e => console.log('error DB'+e));
    });
  }



   private CREATE_TABLE_ESTABLISHMENT="CREATE TABLE IF NOT EXISTS establishment(id INTEGER , name TEXT, type INTEGER);";
   private CREATE_TABLE_SURVEY="CREATE TABLE IF NOT EXISTS survey( "
    +" establishment_id INTEGER NOT NULL, " 
    +" type INTEGER NOT NULL,"
    +" user TEXT,"
    +" save_date TEXT,"
    +" start_date TEXT,"
    +" end_date TEXT,"
    +" survey TEXT,"
    +" latitude TEXT,"
    +" longitude TEXT,"
    +" evidence TEXT,"
    +" sync INTEGER NULL, "
    +" PRIMARY KEY (establishment_id, type) "
    +");";

 
   private DELETE_ESTABLISHMENT=" DELETE FROM establishment  ;";
   private INSERT_ESTABLISHMENT="INSERT INTO establishment (id,name,type)values(?,?,?) ;";
   private INSERT_SURVEY=" INSERT INTO survey (establishment_id,type,user,save_date,"+ 
   +" start_date,end_date,survey,latitude,longitude,evidence,sync) "
   +" values(?,?,?,?,?,?,?,?,?,?,?) ;";
   private SELECT_SURVEY_STATUS=" SELECT COUNT(*) AS tot ,CASE WHEN sync =1 THEN 1 ELSE 0 END AS sync,CASE WHEN sync !=1 THEN 1 ELSE 0 END AS notSync FROM survey ;";

  

   

   createEstablishmentTable(){
     let sql = this.CREATE_TABLE_ESTABLISHMENT;
     return this.query(sql, []);
   }

   createSurveyTable(){
    let sql = this.CREATE_TABLE_SURVEY;
    return this.query(sql, []);
  }



   selectEstablishmentByName(name){
    let sql = "SELECT id, name, type FROM establishment where name LIKE '%"+name+"%'  ;"
    return this.query(sql,[] );
  }

/*
  selectSurveyStatus(){
    
    return this.query(this.SELECT_SURVEY_STATUS,[] ).then(response => {
      let surveyStatus = new SurveySummary();
      for (let index = 0; index < response.rows.length; index++) {
        let obj = response.rows.item(index);
        surveyStatus.tot=obj.tot;
        surveyStatus.sync= obj.sync;
        surveyStatus.notSync= obj.notSync;
      }
      
      return Promise.resolve( surveyStatus );
    });



    
  }

*/

  insertEstablishment(establishment:any){
    let sql = this.INSERT_ESTABLISHMENT;
    return this.query(sql, [establishment.establecimiento_id,establishment.nombre,establishment.tipo_establecimiento_id]);
  }

  insertSurvey(survey:any){
    let sql = this.INSERT_SURVEY;
    return this.query(sql, 
      [
        survey.establishment_id,
        survey.type,
        survey.user,
        survey.save_date,
        survey.start_date,
        survey.end_date,
        survey.survey,
        survey.latitude,
        survey.longitude,
        survey.evidence,
        survey.sync
      ]);
  }


  deleteEstablishment( ){
    let sql = this.DELETE_ESTABLISHMENT;
    return this.query(sql, []);

  }


  

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

 }
