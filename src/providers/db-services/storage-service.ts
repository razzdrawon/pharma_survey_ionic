import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
//import { Survey } from '../../models/survey';
//import { SurveySummary } from '../../models/surveySummary';
import { SQLite } from '@ionic-native/sqlite';
import { Survey } from '../../models/survey';
import { JsonpCallbackContext } from '../../../node_modules/@angular/common/http/src/jsonp';
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
    +" version TEXT,"
    +" latitude TEXT,"
    +" longitude TEXT,"
    +" evidence TEXT,"
    +" sync INTEGER NULL, "
    +" response_code INTEGER NULL, "
    +" PRIMARY KEY (establishment_id, type) "
    +");";

 
   private DELETE_ESTABLISHMENT=" DELETE FROM establishment  ;";
   private INSERT_ESTABLISHMENT="INSERT INTO establishment (id,name,type)values(?,?,?) ;";


   private INSERT_SURVEY="INSERT INTO survey (establishment_id,type,user,save_date, start_date,end_date,survey,version,latitude,longitude,evidence,sync,response_code)  values(?,?,?,?,?,?,?,?,?,?,?,?,?) ;";
   private SELECT_SURVEY_STATUS=" SELECT COUNT(*) AS tot ,CASE WHEN sync =1 THEN 1 ELSE 0 END AS sync,CASE WHEN sync !=1 THEN 1 ELSE 0 END AS notSync FROM survey ;";
   private SELECT_SURVEY_BY_ESTABLISHMENT_AND_TYPE="SELECT * FROM survey WHERE establishment_id  = ? AND type = ? ";
   private SELECT_SURVEY_TO_SYNC=" SELECT * FROM survey WHERE sync!= 1";
   private MARK_SYNC_SURVEY=" UPDATE  survey   SET sync=1 WHERE establishment_id  = ? AND type = ? ";

   
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

  insertEstablishment(establishment:any){
    let sql = this.INSERT_ESTABLISHMENT;
    return this.query(sql, [establishment.establecimiento_id,establishment.nombre,establishment.tipo_establecimiento_id]);
  }

  insertSurvey(survey: Survey){
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
        survey.version,
        survey.latitude,
        survey.longitude,
        survey.evidence,
        survey.sync,
        survey.response_code
      ]);
  }


  markSurveySync(survey: Survey){
    let sql = this.MARK_SYNC_SURVEY;   
    return this.query(sql, 
      [
        survey.establishment_id,
        survey.type
      ]);
  }

  getSurveys() {
    let sql = this.SELECT_SURVEY_STATUS;
    return this.query(sql, []);
  }

  getSurveyToSync() {
    let sql = this.SELECT_SURVEY_TO_SYNC;
    return this.query(sql, []);
  }

  getSurveyByTypeAndEstablishment(establishment_id,type) {
    let sql = this.SELECT_SURVEY_BY_ESTABLISHMENT_AND_TYPE;
    return this.query(sql, [establishment_id,type]);
  }

  deleteEstablishment( ){
    let sql = this.DELETE_ESTABLISHMENT;
    return this.query(sql, []);

  }

 }
