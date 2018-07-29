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

  nestQuestion() {
    //let index = 0;
    // if(index < this.questions.length){
    //   this.question = this.questions[index+1];  
    // }

    let nextSection = this.question.siguiente_seccion;
    let nextQuestion = this.question.siguiente_prgunta;
    let isFinal = this.question.final_seccion;

    if(isFinal == 1) {
      nextSection = this.question.seccion + 1;
      nextQuestion = 1;
    }
    else {
      if(nextQuestion == null) {
        nextQuestion = this.question.seccion_pregunta_id + 1;
      }
    }
    
    console.log('next section: ' + nextSection + ' next question: ' + nextQuestion);
    this.question = this.questions.find(question => (question.seccion == nextSection) && (question.seccion_pregunta_id == nextQuestion));
    
  }

}
