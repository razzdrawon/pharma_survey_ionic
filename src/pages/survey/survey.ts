import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SyncHttpService } from '../../providers/http-services/sync-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SurveyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-survey',
  templateUrl: 'survey.html',
})
export class SurveyPage {

  public questions: any[] = [];
  public question: any = {};

  public answers: any[];
  public answer: any = {};

  public hasChilds: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public syncHttpService: SyncHttpService, private storage: Storage) {
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad SurveyPage');

    this.loadSurvey();
    
    
  }

  loadSurvey() {
    this.storage.get('hospitalSurvey').then(
      (data) => {
        //console.log(data);
        this.questions = JSON.parse(data);
        this.question = this.questions[0];
      },
      err => {
        console.log(err);
      }
    );
  }

  nextQuestion() {

    this.answer.id = this.question.id;
    this.answer.tipo_pregunta = this.question.tipo_pregunta;
    this.answer.indice = this.question.indice;
    this.answer.nivel = this.question.nivel;
    console.log(this.answer);


    let nextSection = this.question.siguiente_seccion;
    let nextQuestion = this.question.siguiente_prgunta;
    let isFinal = this.question.final_seccion;

    switch(this.question.tipo_pregunta) {

      case 1: { // question type 1 (Open answer)
        if(isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else{
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }
      case 2: { // question type 2 (Radio Button)
        nextSection = this.answer.opt.siguiente_seccion;
        nextQuestion = this.answer.opt.siguiente_pregunta;

        if(nextSection == 1 && nextQuestion == null) {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

      case 3: { // question type 3 (Combo Box)
        if(isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else{
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

      case 4: { // question type 4 (Text Area)
        if(isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else{
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

      case 5: { // question type 5 (Text Area)
        if(isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else{
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

    }

    
    console.log('next section: ' + nextSection + ' next question: ' + nextQuestion);
    this.question = this.questions.find(question => (question.seccion == nextSection) && (question.seccion_pregunta_id == nextQuestion));
    if(this.question.tipo_pregunta == 2){
      this.answer = {};
      this.answer.opt = {};
    }
    else{
      this.answer = {};
    }

    
    
  }

  radioOptionChanged() {
    console.log('listener')
    console.log(this.answer);
    if(this.answer.opt.respuestas != null){
      this.hasChilds = true;
    }
    else{
      this.hasChilds = false;
    }
  }

  

}
