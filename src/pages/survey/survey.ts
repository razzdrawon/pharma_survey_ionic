import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SyncHttpService } from '../../providers/http-services/sync-service';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Answer } from '../../models/answer';

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
  public question: any = {}; // current question (displayed in screen)

  public answers: any[] = [];
  public answer: Answer = new Answer();

  public hasChilds: boolean = false;

  public isAnswered: boolean = false;

  public image: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public syncHttpService: SyncHttpService, private storage: Storage, private camera: Camera, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad SurveyPage');
    console.log(this.navParams);
    this.loadSurvey(this.navParams.data);

  }

  loadSurvey(navParams) {

    let tipo=navParams['tipo_establecimiento_id'];
    let sub_tipo=navParams['subtipo_id'];
    let isPharma = false;

    if(tipo== 3 || tipo==4 || (tipo==1 && sub_tipo==3)){
      isPharma = true;
    }



    if(isPharma){

      this.storage.get('pharmaSurvey').then(
      (data) => {
        //console.log(data);
        this.questions = JSON.parse(data);
        this.question = this.questions[0];
        console.log(this.question);
      },
      err => {
        console.log(err);
      }
    );
  } else {
    console.log('hospital');
    this.storage.get('hospitalSurvey').then(
      (data) => {
        //console.log(data);
        this.questions = JSON.parse(data);
        this.question = this.questions[0];
        console.log(this.question);
      },
      err => {
        console.log(err);
      }
    );
  }
  }

  radioOptionChanged() {

    console.log(this.answer);

    if (this.answer.option.respuestas != null || this.answer.option.tipo_pregunta != null) {
      this.hasChilds = true;
    }
    else {
      this.hasChilds = false;
      this.answer.childOption = null;
    }

  }

  radioChildOptionChanged() {

    console.log(this.answer);
    // this.answer.opt = {};
    // this.answer.opt.respuestas = item;
    // console.log(this.answer);
  }

  optionChanged() {

    console.log(this.answer);

  }

  getPicture() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camera.getPicture(options)
      .then(imageData => {
        this.image = `data:image/jpeg;base64,${imageData}`;
        console.log(this.image);
        this.answer.image = this.image;
      })
      .catch(error => {
        console.error(error);
      });
  }


  nextQuestion() {

    if (this.validateSumAnswer()) {
      this.fillAnswerAndPush();
      this.defineNextSectionAndQuestion();
    }

  }

  validateSumAnswer(): any {

    if (this.question.tipo_pregunta == 5 && this.question.valida_respuestas_con_pregunta != null) {

      let sum = null;
      Object.keys(this.answer.map).forEach(key => {
        sum = parseInt(this.answer.map[key]) + sum;
      });

      console.log(this.answers);
      let total = null;
      let answerAux = this.answers.find(answer => answer.question.id == parseInt(this.question.valida_respuestas_con_pregunta));
      if (answerAux.number != null) {
        total = answerAux.number;
      }
      else {
        Object.keys(answerAux.map).forEach(key => {
          total = parseInt(answerAux.map[key]) + total;
        });
      }

      if (sum == total) {
        return true;
      }
      else {
        let alert = this.alertCtrl.create({
          title: 'Respuesta Inválida',
          subTitle: 'Aseguresé de que la suma de los números corresponde con el total de la pregunta: ' + answerAux.question.index + ' el cual fue de: ' + total,
          buttons: ['Ok']
        });
        alert.present();
        return false;
      }

    }
    else {
      return true;
    }

  }

  fillAnswerAndPush() {

    this.answer.question = { id: this.question.id, section: this.question.seccion, section_question: this.question.seccion_pregunta_id, type: this.question.tipo_pregunta, index: this.question.indice, level: this.question.level };

    // fill with useful question info in the answer

    console.log(this.answer);

    // push answer to answers array (saving answer temporary and not in storage yet)
    this.answers.push(this.answer);
  }

  defineNextSectionAndQuestion() {
    let nextSection = this.question.siguiente_seccion;
    let nextQuestion = this.question.siguiente_prgunta;
    let isFinal = this.question.final_seccion;

    switch (this.question.tipo_pregunta) {

      case 1: { // question type 1 (Open answer)
        if (isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }
      case 2: { // question type 2 (Radio Button)
        nextSection = this.answer.option.siguiente_seccion;
        nextQuestion = this.answer.option.siguiente_pregunta;

        if (nextSection == null && nextQuestion == null) {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

      case 3: { // question type 3 (Combo Box)
        if (isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

      case 4: { // question type 4 (Text Area)
        if (isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

      case 5: { // question type 5 (Text Area)
        if (isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }
    }

    console.log('next section: ' + nextSection + ' next question: ' + nextQuestion);
    this.question = this.questions.find(question => (question.seccion == nextSection) && (question.seccion_pregunta_id == nextQuestion));
    if (this.question.tipo_pregunta == 2) {
      this.answer = new Answer();
    }
    else {
      this.answer = new Answer();
      this.answer.number = null;
      this.answer.text = null;
    }
  }

}
